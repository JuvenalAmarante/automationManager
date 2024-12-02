import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { DefaultResponse, FilaItem } from 'src/app/shared/types';

@Component({
	selector: 'app-schedules-queue',
	templateUrl: './schedules-queue.component.html',
	styleUrls: ['./schedules-queue.component.less'],
})
export class SchedulesQueueComponent implements OnInit {
	isLoading = false;
	queueList: FilaItem[] = [];
	dateSync: Date = new Date();

	constructor(private readonly api: ApiService) {}

	ngOnInit(): void {
		this.loadQueue();
	}

	loadQueue(): void {
		this.isLoading = true;
		this.dateSync = new Date();
		this.api
			.get('/agendamentos/fila')
			.pipe(
				finalize(() => {
					this.isLoading = false;
				}),
			)
			.subscribe({
				next: (res: DefaultResponse<FilaItem[]>) => {
					this.queueList = res.data;
				},
			});
	}
}
