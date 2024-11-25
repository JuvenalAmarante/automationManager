import { finalize } from 'rxjs';
import { NgxMaskService } from 'ngx-mask';
import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { debounce, normalizeParams } from 'src/app/shared/helpers';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { DefaultResponse, Cargo, Departamentos, Usuario } from 'src/app/shared/types';
import { PermissionValidateService } from 'src/app/core/services/permission-validate.service';
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

	errorList: string[] = [];

	userPattern = new RegExp('[a-zA-Z]');
	isLoading = false;
	passwordVisible = false;

	constructor(
		private readonly fb: UntypedFormBuilder,
		private readonly api: ApiService,
		private readonly maskService: NgxMaskService,
	) {
		this.userForm = fb.group({
			nome: [null, Validators.required],
			usuario: [null, Validators.required],
			senha: [null],
			admin: [false, [Validators.required]],
			ativo: [true, [Validators.required]],
		});
	}

	ngOnInit() {
		if (this.nzData?.userId) {
			this.getUser(this.nzData?.userId);
			this.userForm.get('senha')?.removeValidators(Validators.required);
		}
	}

	getUser(id: number) {
		this.isLoading = true;
		this.api
			.get(`/usuarios/${id}`)
			.pipe(
				finalize(() => {
					this.isLoading = false;
				}),
			)
			.subscribe({
				next: (res: DefaultResponse<Usuario>) => {
					this.userForm?.patchValue({
						nome: res.data.nome,
						usuario: res.data.usuario,
						admin: res.data.admin,
						ativo: res.data.ativo,
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

	createUser() {
		if (!this.userForm.get('senha')?.value) {
			this.userForm.get('senha')?.setValidators(Validators.required);
			this.userForm.get('senha')?.updateValueAndValidity();

			return;
		}
		this.api
			.post('/usuarios', {
				...this.userForm?.value,
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
			.patch(`/usuarios/${id}`, {
				...this.userForm?.value,
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

	closeErrorAlert(error: string) {
		this.errorList = this.errorList.filter((err) => err !== error);
	}

	closeModal() {
		this.modalRef.close();
	}
}
