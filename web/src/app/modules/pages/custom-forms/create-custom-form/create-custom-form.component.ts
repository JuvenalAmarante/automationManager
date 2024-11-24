import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { stringTransform } from 'src/app/shared/helpers';
import { DefaultResponse, FormularioPersonalizado } from 'src/app/shared/types';
import { SelectCustomFieldsComponent } from '../select-custom-fields/select-custom-fields.component';

@Component({
	selector: 'app-create-custom-form',
	templateUrl: './create-custom-form.component.html',
	styleUrl: './create-custom-form.component.less',
})
export class CreateCustomFormComponent implements OnInit {
	customFormsForm!: FormGroup;
	errorList: string[] = [];
	isLoading = false;
	action = 'Cadastrar';
	customForm!: FormularioPersonalizado;

	constructor(
		private readonly api: ApiService,
		private readonly fb: UntypedFormBuilder,
		private readonly router: Router,
		private readonly activatedRoute: ActivatedRoute,
		private readonly modalService: NzModalService,
	) {
		this.customFormsForm = this.fb.group({
			nome: [null, Validators.required],
			chave: [null, Validators.required],
			ativo: [true, Validators.required],
		});
	}
	ngOnInit() {
		this.customFormsForm.get('nome')?.valueChanges.subscribe((value) => {
			this.customFormsForm.get('chave')?.setValue(stringTransform(value, '_'));
		});

		this.activatedRoute.params.subscribe((params) => {
			if (params['id']) {
				this.getCustomFormDetails();
				this.action = 'Editar';
			}
		});
	}
	handleSubmit() {
		if (this.customForm) {
			return this.updateProtocol();
		}
		return this.createProtocol();
	}

	createProtocol() {
		this.isLoading = true;
		this.api
			.post('/custom-forms', this.customFormsForm.value)
			.pipe(finalize(() => (this.isLoading = false)))
			.subscribe({
				next: (res: DefaultResponse<FormularioPersonalizado>) => {
					if (res.data) {
						this.router.navigateByUrl('/app/formularios/editar/' + res.data.id);
					}
				},
				error: (error) => {
					if (Array.isArray(error.error.message)) this.errorList = error.error.message;
					else this.errorList = [error.error.message];
					this.isLoading = false;
				},
			});
	}
	updateProtocol() {
		this.isLoading = true;
		this.api
			.patch('/custom-forms/' + this.customForm.id, this.customFormsForm.value)
			.pipe(finalize(() => (this.isLoading = false)))
			.subscribe({
				next: (res: DefaultResponse<null>) => {},
				error: (error) => {
					if (Array.isArray(error.error.message)) this.errorList = error.error.message;
					else this.errorList = [error.error.message];
					this.isLoading = false;
				},
			});
	}

	getCustomFormDetails(id?: number) {
		this.isLoading = true;
		this.api
			.get('/custom-forms/' + this.activatedRoute.snapshot.params['id'])
			.pipe(finalize(() => (this.isLoading = false)))
			.subscribe({
				next: (res: DefaultResponse<any>) => {
					this.customForm = res.data;
					this.customFormsForm.patchValue(res.data);
				},
			});
	}

	showModalAddField() {
		this.modalService
			.create({
				nzContent: SelectCustomFieldsComponent,
				nzTitle: 'Adicionar campo no formulário ' + this.customForm.nome.toLowerCase(),
				nzData: {
					isModal: true,
					custom_form_id: this.customForm?.id,
				},
				nzWidth: '50%',
				nzOkText: 'Adicionar',
				nzOkType: 'primary',
			})
			.afterClose.subscribe((res) => {
				this.getCustomFormDetails(this.customForm.id);
			});
	}

	removeCustomField(id: number) {
		this.api.delete(`/custom-forms/${this.customForm.id}/custom-field/${id}`).subscribe({
			next: (res: DefaultResponse<null>) => {
				this.getCustomFormDetails(this.customForm.id);
			},
		});
	}

	getFormControlValidationStatus(controlName: string): string {
		const control = this.customFormsForm.get(controlName);

		if (control && control.touched) {
			return control.errors ? 'error' : 'success';
		}

		return '';
	}
}
