import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { Automacao, DefaultResponse, TipoAgendamento } from 'src/app/shared/types';
import { normalizeParams } from 'src/app/shared/helpers';
import { finalize } from 'rxjs';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Router } from '@angular/router';
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

	fileList: NzUploadFile[] = [];
	errorList: string[] = [];

	weekDaysList = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
	weekDaySelected?: number;

	datetime = null;

	onChange(date: Date): void {
		this.scheduleForm.patchValue({
			horario: date,
		});
	}

	onChangeWeekDay(weekDay: Day): void {
		this.scheduleForm.patchValue({
			horario: nextDay(new Date(), weekDay),
		});
	}

	disabledDate = (current: Date): boolean => differenceInCalendarDays(current, new Date()) < 0;

	constructor(private readonly fb: UntypedFormBuilder, private readonly api: ApiService, private readonly router: Router) {
		this.scheduleForm = this.fb.group({
			automacao_id: [null, [Validators.required]],
			tipo_id: [null, [Validators.required]],
			horario: [null, [Validators.required]],
		});
	}

	ngOnInit(): void {
		this.loadAutomations();
		this.loadTypes();
	}

	loadAutomations(): void {
		this.isLoadingAutomations = true;
		this.api
			.get('/agendamentos/automacoes')
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
		this.isLoadingAutomations = true;
		this.api
			.get('/agendamentos/tipos')
			.pipe(
				finalize(() => {
					this.isLoadingAutomations = false;
				}),
			)
			.subscribe({
				next: (res: DefaultResponse<TipoAgendamento[]>) => {
					this.typesList = res.data;
				},
			});
	}

	async handleSubmit() {
		this.createSchedule();
	}

	beforeUpload = (file: NzUploadFile): boolean => {
		this.scheduleForm.patchValue({ arquivo: file });
		this.fileList = [file];

		return false;
	};

	createSchedule(): void {
		this.isSaving = true;
		this.api
			.post('/agendamentos', normalizeParams(this.scheduleForm.value))
			.pipe(
				finalize(() => {
					this.isSaving = false;
				}),
			)
			.subscribe({
				next: (res: DefaultResponse<null | undefined>) => {
					this.goBack();
				},
			});
	}

	goBack() {
		this.router.navigate(['/app/agendamentos']);
	}

	closeErrorAlert(error: string) {
		this.errorList = this.errorList.filter((err) => err !== error);
	}
}
