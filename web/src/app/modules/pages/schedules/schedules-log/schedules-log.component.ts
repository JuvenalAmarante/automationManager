import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { formatDistance, Locale } from 'date-fns';
import { finalize } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { LogAgendamento, DefaultResponse } from 'src/app/shared/types';

@Component({
	selector: 'app-schedules-log',
	templateUrl: './schedules-log.component.html',
	styleUrls: ['./schedules-log.component.less'],
})
export class SchedulesLogComponent implements OnInit {
	isLoading = false;
	logsList: LogAgendamento[] = [];

	constructor(
		private readonly api: ApiService,
		private readonly activatedRoute: ActivatedRoute,
	) {}

	ngOnInit(): void {
		this.activatedRoute.params.subscribe((params) => {
			if (params['id']) this.loadLogs(+params['id']);
		});
	}

	loadLogs(id: number): void {
		this.isLoading = true;
		this.api
			.get(`/agendamentos/${id}/logs`)
			.pipe(
				finalize(() => {
					this.isLoading = false;
				}),
			)
			.subscribe({
				next: (res: DefaultResponse<LogAgendamento[]>) => {
					this.logsList = res.data.map((data) => ({
						...data,
						criado_em: new Date(data.criado_em).toLocaleString('pt-BR'),
					}));
				},
			});
	}
}
