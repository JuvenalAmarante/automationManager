import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { Agendamento, Automacao, DefaultResponse, TipoAgendamento, TipoParametro } from 'src/app/shared/types';
import { normalizeParams } from 'src/app/shared/helpers';
import { finalize } from 'rxjs';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { ActivatedRoute, Router } from '@angular/router';
import { nextDay, differenceInCalendarDays } from 'date-fns';

@Component({
	selector: 'app-automations-parameter-create',
	templateUrl: './automations-parameter-create.component.html',
	styleUrls: ['./automations-parameter-create.component.less'],
})
export class AutomationsParameterCreateComponent implements OnInit {
	scheduleForm: FormGroup;
	isSaving = false;

	isLoadingAutomations = false;
	automationsList: Automacao[] = [];

	isLoadingAutomationDetails = false;
	automationSelected?: Automacao;

	parametersValues: Record<string, any>[] = [];

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
					this.loadAutomationValues(id)
				},
			});
	}

	loadAutomationValues(id: number): void {
		this.isLoadingAutomationDetails = true;
		this.api
			.get(`/parametros/automacoes/${id}`)
			.pipe(
				finalize(() => {
					this.isLoadingAutomationDetails = false;
				}),
			)
			.subscribe({
				next: (res: DefaultResponse<Record<string, any>[]>) => {
					this.parametersValues = res.data;
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
}
