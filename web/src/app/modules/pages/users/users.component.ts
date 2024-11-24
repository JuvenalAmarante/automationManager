import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/core/services/api.service';
import { PermissionValidateService } from 'src/app/core/services/permission-validate.service';
import { debounce, normalizeParams } from 'src/app/shared/helpers';
import { Cargo, DefaultResponse, Usuario } from 'src/app/shared/types';
import { UsersCondominiumsComponent } from './users-condominiums/users-condominiums.component';
import { UsersCreateComponent } from './users-create/users-create.component';
import { UsersDetailsComponent } from './users-details/users-details.component';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.less'],
})
export class UsersComponent implements OnInit {
	validateForm: FormGroup;
	indexPage: number = 1;
	isLoading = false;
	totalRegistros = 0;
	page: { [key: number]: Usuario[] } = {};

	constructor(
		private readonly fb: FormBuilder,
		private readonly modalServices: NzModalService,
		private readonly api: ApiService,
		private readonly permissionService: PermissionValidateService,
	) {
		this.validateForm = fb.group({
			busca: [null],
			cargos: [null],
			departamentos: [null],
		});
	}

	dataList: Usuario[] = [];

	isLoadingOcupation: boolean = false;
	ocupationsList: Cargo[] = [];

	isLoadingDepartment: boolean = false;

	ngOnInit(): void {
		this.paginate(1);
	}

	getFormControlValidationStatus(controlName: string): string {
		const control = this.validateForm.get(controlName);
		return control?.dirty && control?.errors ? 'error' : '';
	}

	onSearchOcupation(busca: string) {
		this.isLoadingOcupation = true;

		debounce(() => {
			this.ocupationsList = [];
			this.api
				.get(`/ocupations/active`, {
					busca,
				})
				.subscribe({
					next: (res: DefaultResponse<Cargo[]>) => {
						this.ocupationsList = res.data;
					},
					error: () => {
						this.isLoadingOcupation = false;
					},
					complete: () => {
						this.isLoadingOcupation = false;
					},
				});
		});
	}

	submitForm() {
		this.indexPage = 1;
		this.totalRegistros = 0;
		this.getUsers();
	}

	getUsers(page: number = this.indexPage) {
		this.isLoading = true;
		this.api.post(`/users/list?page=${page}`, normalizeParams(this.validateForm.value)).subscribe({
			next: (res: DefaultResponse<Usuario[]>) => {
				if (page > 1) {
					this.page[page] = res.data;
					this.indexPage = page;
				} else {
					this.page[1] = res.data.slice(0, 20);
				}
				this.totalRegistros = res.total_pages || 0;
			},
			error: (err) => {
				this.isLoading = false;
				this.dataList = [];
			},
			complete: () => {
				this.isLoading = false;
			},
		});
	}

	showModalInfo(id?: string): void {
		this.permissionService.validate('usuarios-exibir-dados', () => {
			this.modalServices.info({
				nzContent: UsersDetailsComponent,
				nzTitle: `Dados do Usuário`,
				nzWidth: '40%',
				nzData: {
					isModal: true,
					userId: id,
				},
			});

			this.modalServices.afterAllClose.subscribe(() => this.getUsers());
		});
	}

	showModalEdit(id?: string): void {
		this.permissionService.validate(id ? 'usuarios-atualizar-dados' : 'usuarios-cadastrar', () => {
			this.modalServices.create({
				nzContent: UsersCreateComponent,
				nzTitle: `${id ? 'Editar' : 'Novo'} Usuário`,
				nzWidth: '60%',
				nzData: {
					isModal: true,
					userId: id,
				},
				nzFooter: null,
			});

			this.modalServices.afterAllClose.subscribe(() => this.getUsers());
		});
	}

	showModalLink(user?: Usuario): void {
		this.permissionService.validate('usuarios-limitar-acesso-condominios', () => {
			this.modalServices.create({
				nzContent: UsersCondominiumsComponent,
				nzTitle: `Carteira de condomínios - ${user?.pessoa.nome}`,
				nzBodyStyle: {
					maxHeight: '80vh',
					overflow: 'auto',
				},
				nzCentered: true,
				nzWidth: '70%',
				nzData: {
					isModal: true,
					userId: user?.uuid,
				},
				nzOkText: 'Salvar',
			});

			this.modalServices.afterAllClose.subscribe(() => this.getUsers());
		});
	}

	getReport(path: string) {
		localStorage.setItem('reportUserParams', JSON.stringify(this.validateForm.value));
		window.open('/relatorios/usuario/' + path, '_blank');
	}

	paginate(index: number) {
		if (!this.page[index] && !this.page[index]?.length) {
			this.getUsers(index);
		} else {
			this.indexPage = index;
		}
	}
}
