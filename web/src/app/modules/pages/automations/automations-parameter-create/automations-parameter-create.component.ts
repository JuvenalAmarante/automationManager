import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { Agendamento, Automacao, DefaultResponse, TipoAgendamento, TipoParametro } from 'src/app/shared/types';
import { normalizeParams } from 'src/app/shared/helpers';
import { finalize, Observable, Observer } from 'rxjs';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { ActivatedRoute, Router } from '@angular/router';
import { nextDay, differenceInCalendarDays } from 'date-fns';
import * as XLSX from 'xlsx';

@Component({
	selector: 'app-automations-parameter-create',
	templateUrl: './automations-parameter-create.component.html',
	styleUrls: ['./automations-parameter-create.component.less'],
})
export class AutomationsParameterCreateComponent implements OnInit {
	scheduleForm: FormGroup;
	isSaving = false;
	isVisible = false;
	isVisibleImport = false;
	isLoading = false;

	fileList: NzUploadFile[] = [];

	sheet: Record<string, any>[] = [];

	isLoadingAutomations = false;
	automationsList: Automacao[] = [];

	isLoadingAutomationDetails = false;
	automationSelected?: Automacao;

	parametersValues: Record<string, any>[] = [];

	parameterSelected?: { index: number; page: number; key: string };

	errorList: string[] = [];

	constructor(
		private readonly fb: UntypedFormBuilder,
		private readonly api: ApiService,
		private readonly router: Router,
	) {
		this.scheduleForm = this.fb.group({
			automacao_id: [null, [Validators.required]],
		});
	}

	ngOnInit(): void {
		this.loadAutomations();
	}

	loadAutomations(): void {
		this.isLoadingAutomations = true;
		this.api
			.get('/automacoes')
			.pipe(
				finalize(() => {
					this.isLoadingAutomations = false;
				}),
			)
			.subscribe({
				next: (res: DefaultResponse<Automacao[]>) => {
					this.automationsList = res.data;
				},
			});
	}

	loadAutomationDetail(id: number): void {
		this.isLoadingAutomationDetails = true;
		this.api
			.get(`/automacoes/${id}`)
			.pipe(
				finalize(() => {
					this.isLoadingAutomationDetails = false;
				}),
			)
			.subscribe({
				next: (res: DefaultResponse<Automacao>) => {
					this.automationSelected = res.data;
					this.loadAutomationValues(id);
				},
			});
	}

	loadAutomationValues(id: number): void {
		this.isLoadingAutomationDetails = true;
		this.api
			.get(`/automacoes/${id}/parametros`)
			.pipe(
				finalize(() => {
					this.isLoadingAutomationDetails = false;
				}),
			)
			.subscribe({
				next: (res: DefaultResponse<Record<string, any>[]>) => {
					let listParamets: string[] = [];

					if (this.automationSelected?.parametros) {
						listParamets = this.automationSelected?.parametros?.map((parameter) => parameter.nome);
					}

					this.parametersValues = res.data.map((item) => {
						if (this.automationSelected?.parametros) {
							Object.keys(item).forEach((key) => {
								if (!listParamets.includes(key)) delete item[key];
							});
						}

						return item;
					});
				},
			});
	}

	async handleSubmit() {
		return this.updateAutomationParams();
	}

	updateAutomationParams(): void {
		this.isSaving = true;
		this.api
			.patch(`/automacoes/${this.automationSelected?.id}/parametros`, { parametros: this.parametersValues })
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

	addParameterValue() {
		const value: Record<string, any> = {};
		this.automationSelected?.parametros?.forEach((parameter) => {
			value[parameter.nome] = null;

			if (parameter.tipo_parametro_id == 8) value[parameter.nome] = [];
		});

		this.parametersValues = [...this.parametersValues, value];
	}

	removeParameterValue(index: number) {
		const newList = this.parametersValues.filter((item, idx) => idx != index);

		this.parametersValues = newList;
	}

	goBack() {
		this.router.navigate(['/app/agendamentos']);
	}

	closeErrorAlert(error: string) {
		this.errorList = this.errorList.filter((err) => err !== error);
	}

	onChange(texto: string) {
		console.log(texto);
	}

	showModalImport() {
		this.isVisibleImport = true;
	}

	showModal(index: number, page: number, key: string): void {
		this.isVisible = true;

		this.parameterSelected = {
			index,
			page,
			key,
		};
	}

	handleCancel(): void {
		this.isVisible = false;
	}

	handleOk(): void {
		this.isVisible = false;
	}

	handleImportCancel(): void {
		this.isVisibleImport = false;
	}

	handleImportOk(): void {
		this.isLoading = true;

		this.loadSheet();
	}

	addItemParameterValue() {
		if (this.parameterSelected) {
			this.parametersValues[this.parameterSelected.index + (this.parameterSelected.page - 1) * 20][this.parameterSelected.key] = [
				...this.parametersValues[this.parameterSelected.index + (this.parameterSelected.page - 1) * 20][this.parameterSelected.key],
				'',
			];
		}
	}

	removeItemParameterValue(index: number) {
		if (this.parameterSelected) {
			const newList = this.parametersValues[this.parameterSelected.index + (this.parameterSelected.page - 1) * 20][this.parameterSelected.key].filter(
				(item: string, idx: number) => idx != index,
			);

			this.parametersValues[this.parameterSelected.index + (this.parameterSelected.page - 1) * 20][this.parameterSelected.key] = newList;
		}
	}

	beforeUpload = (file: NzUploadFile): boolean => {
		this.fileList = [file];

		const reader = new FileReader();

		reader.onload = () => {
			const arrayBuffer: any = reader.result;
			const data = new Uint8Array(arrayBuffer);
			const arr = new Array();
			for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
			var bstr = arr.join('');

			const workbook = XLSX.read(bstr, { type: 'binary' });
			const first_sheet_name = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[first_sheet_name];

			this.sheet = XLSX.utils.sheet_to_json(worksheet, {
				raw: true,
			});
			console.log('🚀 ~ AutomationsParameterCreateComponent ~ workbook:', this.sheet);
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		reader.readAsArrayBuffer(file as any);

		return false;
	};

	excelDateToJSDate(serial: number) {
		const utc_days = Math.floor(serial - 25569);
		const utc_value = utc_days * 86400;
		const milisecondsPerHour = 3600000;
		const date_info = new Date(utc_value * 1000 + 3 * milisecondsPerHour);
		return date_info;
	}

	loadSheet() {
		if (this.automationSelected?.parametros) {
			let namesList: string[] = this.automationSelected.parametros.map((parametro) => parametro.nome);

			this.parametersValues = this.sheet.map((item) => {
				const obj: Record<string, string | number | Date | Array<string>> = {};

				Object.keys(item).forEach((key) => {
					if (this.automationSelected && this.automationSelected.parametros) {
						const indexKey = namesList.indexOf(key.trim());

						if (indexKey != -1) {
							const value = item[key.trim()];
							const date = new Date();
							let formatedValue: string | number | Date | Array<string>;

							switch (this.automationSelected.parametros[indexKey].tipo_parametro_id) {
								case 1:
									formatedValue = value;
									break;
								case 2:
									if (typeof value == 'string' && !isNaN(+value)) formatedValue = +value;
									else formatedValue = value;
									break;
								case 3:
									if (value > 0) {
										date.setDate(value);
										formatedValue = date;
									} else formatedValue = '';
									break;
								case 4:
									if (value > 0) {
										date.setMonth(value - 1);
										formatedValue = date;
									} else formatedValue = '';
									break;
								case 5:
									if (value > 0) {
										date.setFullYear(value);
										formatedValue = date;
									} else formatedValue = '';
									break;
								case 6:
									if (typeof value == 'number') formatedValue = this.excelDateToJSDate(value);
									else formatedValue = value;
									break;
								case 7:
									if (typeof value == 'number') formatedValue = this.excelDateToJSDate(value);
									else formatedValue = value;
									break;
								case 8:
									formatedValue = value.split(',').map((item: string) => item.trim());
									break;
								default:
									formatedValue = value;
									break;
							}

							if (formatedValue) obj[key] = formatedValue;
						}
					}
				});

				return obj;
			});
		}

		this.isLoading = false;
		this.isVisibleImport = false;
	}
}
