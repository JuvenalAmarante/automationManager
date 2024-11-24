import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { SchedulesCreateComponent } from './schedules-create/schedules-create.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Agendamento, DefaultResponse, Profile } from 'src/app/shared/types';
import { finalize } from 'rxjs';
import { PermissionValidateService } from 'src/app/core/services/permission-validate.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-schedules',
	templateUrl: './schedules.component.html',
	styleUrls: ['./schedules.component.less'],
})
export class SchedulesComponent implements OnInit {
	isLoading = false;
	validateForm!: FormGroup;
	dataList: Agendamento[] = [];
	profile?: Profile;

	constructor(
		private readonly api: ApiService,
		private readonly modalService: NzModalService,
		private readonly permissionService: PermissionValidateService,
    private readonly router: Router
	) {}

	ngOnInit(): void {
		this.getSchedulesList();
	}

	getFormControlValidationStatus(controlName: string): string {
		const control = this.validateForm.get(controlName);
		return control?.dirty && control?.errors ? 'error' : '';
	}

	getSchedulesList(values?: { busca: string; nac: boolean; ativo: boolean }) {
		this.isLoading = true;

		this.api
			.get('/agendamentos', values || {})
			.pipe(
				finalize(() => {
					this.isLoading = false;
				}),
			)
			.subscribe({
				next: (res: DefaultResponse<Agendamento[]>) => {
					this.dataList = res.data;
				},
			});
	}

	removeSchedule(id: number) {
		this.api
			.delete(`/agendamentos/${id}`)
			.pipe(
				finalize(() => {
					this.isLoading = false;
				}),
			)
			.subscribe({
				next: (res: DefaultResponse<undefined | null>) => {
					this.getSchedulesList();
				},
			});
	}
}
