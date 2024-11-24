import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { DefaultResponse, SystemParam } from 'src/app/shared/types';

@Injectable({
	providedIn: 'root',
})
export class SystemService {
	systemParams: SystemParam[] = [];
	constructor(private readonly apiService: ApiService) {}

	getParams(): Promise<SystemParam[]> {
		return new Promise((resolve) =>
			this.apiService.get('/system-params/active').subscribe({
				next: (res: DefaultResponse<SystemParam[]>) => {
					this.systemParams = res.data;
					resolve(res.data);
				},
			}),
		);
	}

	getParam(key: string): Promise<SystemParam | null> {
		return new Promise((resolve) =>
			this.apiService.get('/system-params/active').subscribe({
				next: (res: DefaultResponse<SystemParam[]>) => resolve(res.data.length ? res.data.filter((param) => param.chave == key)[0] : null),
			}),
		);
	}
}
