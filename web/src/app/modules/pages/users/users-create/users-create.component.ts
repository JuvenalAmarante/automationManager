import { finalize } from 'rxjs';
import { NgxMaskService } from 'ngx-mask';
import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { debounce, normalizeParams } from 'src/app/shared/helpers';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { DefaultResponse, Cargo, Departamentos, Usuario } from 'src/app/shared/types';
import { PermissionValidateService } from 'src/app/core/services/permission-validate.service';
import { OcupationsCreateComponent } from '../../ocupations/ocupations-create/ocupations-create.component';
import { ContactType } from 'src/app/shared/constants/contact-types';

type data = { isModal?: boolean; userId?: number; isBiker?: boolean };

@Component({
	selector: 'app-users-create',
	templateUrl: './users-create.component.html',
	styleUrls: ['./users-create.component.less'],
})
export class UsersCreateComponent implements OnInit {
	userForm: FormGroup;

	nzData: data = inject(NZ_MODAL_DATA);
	modalRef: NzModalRef = inject(NzModalRef);

	isLoadingOcupation: boolean = false;
	isLoadingDepartment: boolean = false;

	hasPermissionOcupation: boolean = false;
	hasPermissionDepartment: boolean = false;

	errorList: string[] = [];

	ocupationsList: Cargo[] = [];
	departmentsList: Departamentos[] = [];
	savedDepartmentsList: number[] = [];
	canSelectAllDepartments = false;
	userPattern = new RegExp('[a-zA-Z]');
	isLoading = false;
	passwordVisible = false;

	constructor(
		private readonly fb: UntypedFormBuilder,
		private readonly api: ApiService,
		private readonly maskService: NgxMaskService,
		private readonly modalService: NzModalService,
		private readonly permissionService: PermissionValidateService,
	) {
		this.userForm = fb.group({
			email: [null, [Validators.required, Validators.email]],
			nome: [null, Validators.required],
			username: [null, Validators.required],
			password: [null],
			telefone: [null],
			whatsapp: [null],
			ramal: [null],
			acessa_todos_departamentos: [false],
			cargo_id: [null, Validators.required],
			departamentos: [null],
			ativo: [true, [Validators.required]],
		});
	}

	ngOnInit() {
		this.hasPermissions();
		this.onSearchOcupation();
		this.onSearchDepartments();

		if (this.nzData?.userId) {
			this.getUser(this.nzData?.userId);
			this.userForm.get('password')?.removeValidators(Validators.required);
		}

		if (this.nzData?.isBiker) {
			this.userForm.patchValue({
				tipo_usuario: 2,
			});
		}

		this.updateProfilePermissions();
	}

	getUser(id: number) {
		this.isLoading = true;
		this.api
			.get(`/users/${id}`)
			.pipe(
				finalize(() => {
					this.isLoading = false;
				}),
			)
			.subscribe({
				next: (res: DefaultResponse<Usuario>) => {
					this.savedDepartmentsList = res.data.departamentos.map((departamento) => departamento.departamento_id);

					this.userForm?.patchValue({
						email: res.data.email,
						nome: res.data.pessoa.nome,
						username: res.data.username,
						cargo_id: res.data.empresas[0].cargo?.id || null,
						tipo_usuario: res.data.empresas[0].tipo_usuario,
						acessa_todos_departamentos: res.data.acessa_todos_departamentos,
						departamentos: this.savedDepartmentsList,
						ativo: res.data.ativo,
					});

					res.data.pessoa.contatos.forEach((item) => {
						if (item.tipo === ContactType.WHATSAPP) {
							this.userForm.patchValue({ whatsapp: this.maskService.applyMask(item.contato, '(00)00000-0000 || (00)0000-0000') });
						}

						if (item.tipo === ContactType.TELEFONE) {
							this.userForm.patchValue({ telefone: this.maskService.applyMask(item.contato, '(00)00000-0000 || (00)0000-0000') });
						}

						if (item.tipo === ContactType.RAMAL) {
							this.userForm.patchValue({ ramal: item.contato });
						}
					});

					this.isLoading = false;
				},
			});
	}

	validateUserName() {
		let regExp = /[^a-zA-Z0-9._]/g;
		let username = this.userForm.get('username')?.value.replace(regExp, '').toLowerCase();
		this.userForm.patchValue({ username });
	}

	submitForm() {
		if (this.nzData?.userId) {
			this.updateUser(this.nzData?.userId);
		} else {
			this.createUser();
		}
	}

	onSearchOcupation(busca?: string) {
		debounce(() => {
			this.isLoadingOcupation = true;
			this.api
				.get(`/ocupations/active`, {
					busca: busca || '',
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
		}, 1);
	}

	updateOcupationList = () => this.onSearchOcupation();

	updateProfilePermissions() {
		this.api.get('/perfil').subscribe({
			next: (
				res: DefaultResponse<{
					nome: string;
					empresa: string;
					acessa_todos_departamentos: boolean;
				}>,
			) => {
				if (res.data.acessa_todos_departamentos) {
					this.canSelectAllDepartments = true;
				}
			},
		});
	}

	createUser() {
		if (!this.userForm.get('password')?.value) {
			this.userForm.get('password')?.setValidators(Validators.required);
			this.userForm.get('password')?.updateValueAndValidity();

			return;
		}
		this.api
			.post('/users', {
				departamentos: [],
				...this.userForm?.value,
				tipo_usuario: this.nzData.isBiker ? 2 : this.userForm.get('tipo_usuario')?.value,
				whatsapp: this.maskService.removeMask(this.userForm.get('whatsapp')?.value),
				telefone: this.maskService.removeMask(this.userForm.get('telefone')?.value),
			})
			.subscribe({
				next: () => {
					this.closeModal();
				},
				error: (res) => {
					if (Array.isArray(res.error.message)) this.errorList = res.error.message;
					else this.errorList = [res.error.message];
				},
			});
	}

	updateUser(id: number) {
		this.api
			.patch(`/users/${id}`, {
				...this.userForm?.value,
				whatsapp: this.maskService.removeMask(this.userForm.get('whatsapp')?.value),
				telefone: this.maskService.removeMask(this.userForm.get('telefone')?.value),
			})
			.subscribe({
				next: () => {
					this.closeModal();
				},
				error: (res) => {
					if (Array.isArray(res.error.message)) this.errorList = res.error.message;
					else this.errorList = [res.error.message];
				},
			});
	}

	onSearchDepartments(value: string = '') {
		debounce(() => {
			this.isLoadingDepartment = true;
			this.api.post(`/departments/list`, { busca: value }).subscribe({
				next: (res: DefaultResponse<Departamentos[]>) => {
					this.departmentsList = res.data;
				},
				error: () => {
					this.isLoadingDepartment = false;
				},
				complete: () => {
					this.isLoadingDepartment = false;
				},
			});
		}, 2);
	}

	hasPermissions() {
		this.permissionService.validate(
			'cargos-cadastrar',
			() => {
				this.hasPermissionOcupation = true;
			},
			() => {},
			false,
		);
		this.permissionService.validate(
			'departamentos-cadastrar',
			() => {
				this.hasPermissionDepartment = true;
			},
			() => {},
			false,
		);
	}

	showModalOcupation() {
		this.permissionService.validate('cargos-cadastrar', () => {
			this.modalService
				.create({
					nzContent: OcupationsCreateComponent,
					nzTitle: 'Adicionar novo cargo',
					nzData: { isModal: true },
					nzFooter: null,
				})
				.afterClose.subscribe((res) => {
					this.updateOcupationList();
				});
		});
	}

	closeErrorAlert(error: string) {
		this.errorList = this.errorList.filter((err) => err !== error);
	}

	updateDepartmentsList = () => this.onSearchDepartments();

	closeModal() {
		this.modalRef.close();
	}
}
