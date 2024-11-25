import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { Agendamento, Automacao, DefaultResponse, TipoAgendamento } from 'src/app/shared/types';
import { normalizeParams } from 'src/app/shared/helpers';
import { finalize } from 'rxjs';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { ActivatedRoute, Router } from '@angular/router';
import { Day, differenceInCalendarDays } from 'date-fns';
import { nextDay } from 'date-fns';

@Component({
	selector: 'app-schedules-create',
	templateUrl: './schedules-create.component.html',
	styleUrls: ['./schedules-create.component.less'],
})
export class SchedulesCreateComponent implements OnInit {
	scheduleForm: FormGroup;
	isSaving = false;

	isLoadingTypes = false;
	typesList: TipoAgendamento[] = [];

	isLoadingAutomations = false;
	automationsList: Automacao[] = [];

	isLoadingAutomationDetails = false;
	automationSelected?: Automacao;

	isLoadingScheduleDetails = false;
	scheduleDetails?: Agendamento;

	errorList: string[] = [];

	weekDaysList = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
	weekDaySelected?: number;

	datetime?: Date;

	constructor(
		private readonly fb: UntypedFormBuilder,
		private readonly api: ApiService,
		private readonly router: Router,
		private readonly activatedRoute: ActivatedRoute,
	) {
		this.scheduleForm = this.fb.group({
			automacao_id: [null, [Validators.required]],
			tipo_id: [null, [Validators.required]],
			horario: [null, [Validators.required]],
		});
	}

	ngOnInit(): void {
		this.loadAutomations();
		this.loadTypes();

		this.activatedRoute.params.subscribe((params) => {
			if (params['id']) this.loadScheduleDetail(+params['id']);
		});
	}

	loadScheduleDetail(id: number): void {
		this.isLoadingScheduleDetails = true;
		this.api
			.get(`/agendamentos/${id}`)
			.pipe(
				finalize(() => {
					this.isLoadingScheduleDetails = false;
				}),
			)
			.subscribe({
				next: (res: DefaultResponse<Agendamento>) => {
					this.scheduleForm.patchValue({
						automacao_id: res.data.Automacao.id,
						tipo_id: res.data.TipoAgendamento.id,
						horario: res.data.proxima_execucao,
					});

					this.datetime = new Date(res.data.proxima_execucao);

					this.scheduleDetails = res.data;
				},
			});
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

	loadTypes(): void {
		this.isLoadingTypes = true;
		this.api
			.get('/agendamentos/tipos')
			.pipe(
				finalize(() => {
					this.isLoadingTypes = false;
				}),
			)
			.subscribe({
				next: (res: DefaultResponse<TipoAgendamento[]>) => {
					this.typesList = res.data;
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
				},
			});
	}

	async handleSubmit() {
		if (this.scheduleDetails) return this.updateSchedule();
		return this.createSchedule();
	}

	createSchedule(): void {
		this.isSaving = true;
		this.api
			.post('/agendamentos', { ...this.scheduleForm.value })
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

	updateSchedule(): void {
		this.isSaving = true;
		this.api
			.patch(`/agendamentos/${this.scheduleDetails?.id}`, { ...this.scheduleForm.value })
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

	onChange(date: Date): void {
		this.scheduleForm.patchValue({
			horario: date,
		});
	}

	onChangeWeekDay(weekDay: Day): void {
		this.datetime = nextDay(new Date(), weekDay);
		this.scheduleForm.patchValue({
			horario: nextDay(new Date(), weekDay),
		});
	}

	disabledDate = (current: Date): boolean => differenceInCalendarDays(current, new Date()) < 0;

	goBack() {
		this.router.navigate(['/app/agendamentos']);
	}

	closeErrorAlert(error: string) {
		this.errorList = this.errorList.filter((err) => err !== error);
	}
}
