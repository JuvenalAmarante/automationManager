import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { DefaultResponse, TipoParametro } from 'src/app/shared/types';
import { normalizeParams } from 'src/app/shared/helpers';
import { finalize } from 'rxjs';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Router } from '@angular/router';

@Component({
	selector: 'app-automations-create',
	templateUrl: './automations-create.component.html',
	styleUrls: ['./automations-create.component.less'],
})
export class AutomationsCreateComponent implements OnInit {
	automationForm: FormGroup;
	isSaving = false;

	parametersList: { nome: string; tipo_parametro_id: number; qtd_digitos?: number }[] = [];

	isLoadingTypes = false;
	typesList: TipoParametro[] = [];

	fileList: NzUploadFile[] = [];

	errorList: string[] = [];

	constructor(private readonly fb: UntypedFormBuilder, private readonly api: ApiService, private readonly router: Router) {
		this.automationForm = this.fb.group({
			nome: [null, [Validators.required]],
			arquivo: [null, [Validators.required]],
		});
	}

	ngOnInit(): void {
		this.loadTypes();
	}

	loadTypes(): void {
		this.isLoadingTypes = true;
		this.api
			.get('/automacoes/tipos-parametros')
			.pipe(
				finalize(() => {
					this.isLoadingTypes = false;
				}),
			)
			.subscribe({
				next: (res: DefaultResponse<TipoParametro[]>) => {
					this.typesList = res.data;
				},
			});
	}

	async handleSubmit() {
		this.createAutomation();
	}

	beforeUpload = (file: NzUploadFile): boolean => {
		this.automationForm.patchValue({ arquivo: file });
		this.fileList = [file];

		return false;
	};

	createAutomation(): void {
		this.isSaving = true;
		const form = new FormData();

		form.append('nome', this.automationForm.value.nome);
		form.append('arquivo', this.automationForm.value.arquivo);
		this.parametersList.forEach(parameter => {
			form.append('parametros[]', JSON.stringify(parameter));
		})

		this.api
			.post('/automacoes', form)
			.pipe(
				finalize(() => {
					this.isSaving = false;
				}),
			)
			.subscribe({
				next: (res: DefaultResponse<null | undefined>) => {
					this.goBack();
				},
				error: (err) => {
					this.errorList = [err.error.message]
				}
			});
	}

	goBack() {
		this.router.navigate(['/app/automacoes']);
	}

	closeErrorAlert(error: string) {
		this.errorList = this.errorList.filter((err) => err !== error);
	}

	addParameter() {
		this.parametersList.push({
			nome: '',
			tipo_parametro_id: 0,
		});
	}

	removeParameter(index: number) {
		this.parametersList.splice(index, 1);
	}
}
