import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { Automacao, DefaultResponse, TipoParametro } from 'src/app/shared/types';
import { normalizeParams } from 'src/app/shared/helpers';
import { finalize } from 'rxjs';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-automations-create',
	templateUrl: './automations-create.component.html',
	styleUrls: ['./automations-create.component.less'],
})
export class AutomationsCreateComponent implements OnInit {
	automationForm: FormGroup;
	isSaving = false;
	isVisible = false;

	parameterSelected?: { index: number };

	parametersList: {
		nome: string;
		tipo_parametro_id: number;
		qtd_digitos?: number;
		opcoes: string[];
	}[] = [];

	isLoadingTypes = false;
	typesList: TipoParametro[] = [];

	fileList: NzUploadFile[] = [];
	complementFileList: NzUploadFile[] = [];

	isLoadingDetails = false;
	automationDetails?: Automacao;

	errorList: string[] = [];

	constructor(
		private readonly fb: UntypedFormBuilder,
		private readonly api: ApiService,
		private readonly router: Router,
		private readonly activatedRoute: ActivatedRoute,
	) {
		this.automationForm = this.fb.group({
			nome: [null, [Validators.required]],
			arquivo: [null, [Validators.required]],
			complementos: [null],
		});
	}

	ngOnInit(): void {
		this.loadTypes();

		this.activatedRoute.params.subscribe((params) => {
			if (params['id']) this.loadAutomationDetail(+params['id']);
		});
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

	loadAutomationDetail(id: number): void {
		this.isLoadingDetails = true;
		this.api
			.get(`/automacoes/${id}`)
			.pipe(
				finalize(() => {
					this.isLoadingDetails = false;
				}),
			)
			.subscribe({
				next: (res: DefaultResponse<Automacao>) => {
					this.automationForm.patchValue({
						nome: res.data.nome,
						arquivo: res.data.arquivo,
					});

					if (res.data.parametros)
						this.parametersList = res.data.parametros.map((parametro) => ({
							nome: parametro.nome,
							qtd_digitos: parametro.qtd_digitos,
							tipo_parametro_id: parametro.tipo_parametro_id,
							opcoes: parametro.opcoes || []
						}));

					this.automationDetails = res.data;
				},
			});
	}

	async handleSubmit() {
		if (this.automationDetails) return this.updateAutomation();
		return this.createAutomation();
	}

	beforeUpload = (file: NzUploadFile): boolean => {
		this.automationForm.patchValue({ arquivo: file });
		this.fileList = [file];

		return false;
	};

	beforeComplementUpload = (file: NzUploadFile): boolean => {
		this.complementFileList = [...this.complementFileList, file];
		this.automationForm.patchValue({ complementos: this.complementFileList });

		return false;
	};

	createAutomation(): void {
		this.isSaving = true;
		const form = new FormData();

		form.append('nome', this.automationForm.value.nome);
		form.append('arquivo', this.automationForm.value.arquivo);
		
		this.parametersList.forEach((parameter) => {
			form.append('parametros[]', JSON.stringify(parameter));
		});

		this.automationForm.value.complementos?.forEach((parameter: any) => {
			form.append('complementos', parameter);
		});

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
					this.errorList = [err.error.message];
				},
			});
	}

	updateAutomation(): void {
		this.isSaving = true;
		const form = new FormData();

		form.append('nome', this.automationForm.value.nome);
		this.parametersList.forEach((parameter) => {
			form.append('parametros[]', JSON.stringify(parameter));
		});

		if (this.fileList.length) {
			form.append('arquivo', this.automationForm.value.arquivo);

			this.automationForm.value.complementos?.forEach((parameter: any) => {
				form.append('complementos', parameter);
			});
		}

		this.api
			.patch(`/automacoes/${this.automationDetails?.id}`, form)
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
					this.errorList = [err.error.message];
				},
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
			opcoes: []
		});
	}

	removeParameter(index: number) {
		this.parametersList.splice(index, 1);
	}

	handleCancel(): void {
		this.isVisible = false;
	}

	handleOk(): void {
		this.isVisible = false;
	}

	showModal(index: number): void {
		this.isVisible = true;

		this.parameterSelected = {
			index,
		};
	}

	addItemParameterValue() {
		if (this.parameterSelected) {
			if (this.parametersList[this.parameterSelected.index].opcoes)
				this.parametersList[this.parameterSelected.index].opcoes = [...this.parametersList[this.parameterSelected.index].opcoes!, ''];
			else this.parametersList[this.parameterSelected.index].opcoes = [''];
		}
	}

	removeItemParameterValue(index: number) {
		if (this.parameterSelected) {
			const newList = this.parametersList[this.parameterSelected.index].opcoes?.filter((item: string, idx: number) => idx != index);

			this.parametersList[this.parameterSelected.index].opcoes = newList;
		}
	}
}
