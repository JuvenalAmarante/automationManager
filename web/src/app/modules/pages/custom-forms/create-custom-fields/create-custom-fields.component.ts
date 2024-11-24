import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/core/services/api.service';
import { customFieldElements, customFieldTypes } from 'src/app/shared/constants/custom-fields-types';
import { stringTransform } from 'src/app/shared/helpers';
import { CampoPersonalizado, DefaultResponse } from '../../../../shared/types';

@Component({
	selector: 'app-create-custom-fields',
	templateUrl: './create-custom-fields.component.html',
	styleUrl: './create-custom-fields.component.less',
})
export class CreateCustomFieldsComponent implements OnInit {
	customFieldsForm!: FormGroup;
	errorList: string[] = [];
	modalRef: NzModalRef = inject(NzModalRef);
	nzData: { isModal: boolean; custom_field_id?: number | undefined } = inject(NZ_MODAL_DATA);
	listOfOption: Array<{
		id: number;
		value: string;
		ativo: boolean;
	}> = [];
	listOfTagOptions: string[] = [];
	listOfTagsToRemove: number[] = [];
	listOfTagsToAdd: string[] = [];
	elementos!: { value: string; label: string }[];

	inputTypes!: { value: string; label: string }[];

	constructor(private readonly fb: UntypedFormBuilder, private readonly api: ApiService) {
		this.customFieldsForm = this.fb.group({
			chave: [null, [Validators.required, Validators.pattern(/^[a-z_]+$/)]],
			label: [null, Validators.required],
			elemento: [null, Validators.required],
			tipo_input: [null, Validators.required],
			mensagem_validacao: [null, Validators.required],
			placeholder: [null],
			caracteres_max: [null, Validators.required],
			valor_padrao: [null],
			tooltip: [null],
			ativo: [true],
		});

		this.modalRef.updateConfig({
			nzOnOk: () => this.handleSubmit(),
			nzOkDisabled: !this.customFieldsForm.valid,
		});

		this.elementos = customFieldElements;
		this.inputTypes = customFieldTypes;
	}
	ngOnInit(): void {
		const fields = ['tipo_input', 'caracteres_max'];
		this.customFieldsForm.valueChanges.subscribe((value) => {
			this.modalRef.updateConfig({
				nzOkDisabled: !this.customFieldsForm.valid || (value.elemento === 'select' && !this.listOfTagOptions.length),
			});
		});

		this.customFieldsForm.get('elemento')?.valueChanges.subscribe((value) => {
			if (value === 'select') {
				fields.forEach((field) => {
					this.customFieldsForm.removeControl(field);
				});
				this.modalRef.updateConfig({
					nzOkDisabled: !this.customFieldsForm.valid || !this.listOfTagOptions.length,
				});
			}
			if (value === 'input') {
				fields.forEach((field) => {
					this.customFieldsForm.addControl(field, this.fb.control(null, Validators.required));
					this.customFieldsForm.get(field)?.updateValueAndValidity();
				});
				this.modalRef.updateConfig({
					nzOkDisabled: !this.customFieldsForm.valid,
				});
			}
		});

		if (this.nzData?.custom_field_id) {
			this.getCustomFieldDetails();
		}

		this.customFieldsForm.get('label')?.valueChanges.subscribe((value) => {
			this.customFieldsForm.get('chave')?.setValue(stringTransform(value, '_'));
		});
	}

	handleSubmit() {
		if (this.nzData?.custom_field_id) {
			return this.updateCustomField();
		}
		return this.createCustomField();
	}

	createCustomField() {
		return new Promise((resolve, reject) => {
			this.api.post('/custom-fields', { ...this.customFieldsForm.value, opcoes: this.listOfTagOptions }).subscribe({
				next: (res: DefaultResponse<null>) => {
					resolve(true);
				},
				error: (error) => {
					if (Array.isArray(error.error.message)) this.errorList = error.error.message;
					else this.errorList = [error.error.message];
					reject(false);
				},
			});
		});
	}

	updateCustomField() {
		return new Promise((resolve, reject) => {
			this.api
				.patch(`/custom-fields/${this.nzData.custom_field_id}`, {
					...this.customFieldsForm.value,
					opcoes: this.listOfTagOptions,
					opcoes_removidas: this.listOfTagsToRemove,
				})
				.subscribe({
					next: (res: DefaultResponse<null>) => {
						resolve(true);
					},
					error: (error) => {
						if (Array.isArray(error.error.message)) this.errorList = error.error.message;
						else this.errorList = [error.error.message];
						reject(false);
					},
				});
		});
	}

	getCustomFieldDetails() {
		this.api.get(`/custom-fields/${this.nzData.custom_field_id}`).subscribe({
			next: (res: DefaultResponse<CampoPersonalizado>) => {
				this.listOfOption = res.data.campo_personalizado_opcoes;
				this.listOfTagOptions = res.data.campo_personalizado_opcoes.map((item) => item.value);
				this.customFieldsForm.patchValue(res.data);
			},
		});
	}

	closeErrorAlert(error: string) {
		this.errorList = this.errorList.filter((err) => err !== error);
	}

	getFormControlValidationStatus(controlName: string): string {
		const control = this.customFieldsForm.get(controlName);

		if (control && control.touched) {
			return control.errors ? 'error' : 'success';
		}

		return '';
	}

	optionChange(value: string[]) {
		this.listOfTagsToRemove = this.listOfOption.filter((item) => !value.includes(item.value)).map((item) => item.id);
		if (this.customFieldsForm.get('elemento')?.value === 'select') {
			this.modalRef.updateConfig({
				nzOkDisabled: !this.customFieldsForm.valid || !this.listOfTagOptions.length,
			});
		} else {
			this.modalRef.updateConfig({
				nzOkDisabled: !this.customFieldsForm.valid,
			});
		}
	}
}
