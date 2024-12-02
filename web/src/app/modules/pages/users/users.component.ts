import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/core/services/api.service';
import { PermissionValidateService } from 'src/app/core/services/permission-validate.service';
import { normalizeParams } from 'src/app/shared/helpers';
import { Cargo, DefaultResponse, Usuario } from 'src/app/shared/types';
import { UsersCreateComponent } from './users-create/users-create.component';
import { UsersDetailsComponent } from './users-details/users-details.component';
import { UsersAutomationComponent } from './users-automation/users-automation.component';

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

	submitForm() {
		this.indexPage = 1;
		this.totalRegistros = 0;
		this.getUsers();
	}

	getUsers(page: number = this.indexPage) {
		this.isLoading = true;
		this.api.get(`/usuarios?pagina=${page}`, normalizeParams(this.validateForm.value)).subscribe({
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

	showModalInfo(id?: number): void {
		this.modalServices.info({
			nzContent: UsersDetailsComponent,
			nzTitle: `Dados do Usuário`,
			nzWidth: '40%',
			nzData: {
				isModal: true,
				userId: id,
			},
		});
	}

	showModalEdit(id?: number): void {
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
	}

	showModalLink(user?: Usuario): void {
		this.modalServices.create({
			nzContent: UsersAutomationComponent,
			nzTitle: `Vincular automações - ${user?.nome}`,
			nzBodyStyle: {
				maxHeight: '80vh',
				overflow: 'auto',
			},
			nzCentered: true,
			nzWidth: '70%',
			nzData: {
				isModal: true,
				userId: user?.id,
			},
			nzOkText: 'Salvar',
		});

		this.modalServices.afterAllClose.subscribe(() => this.getUsers());
	}

	paginate(index: number) {
		if (!this.page[index] && !this.page[index]?.length) {
			this.getUsers(index);
		} else {
			this.indexPage = index;
		}
	}
}
