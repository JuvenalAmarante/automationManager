import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { NzModalService } from 'ng-zorro-antd/modal';

@Injectable({
	providedIn: 'root',
})
export class PermissionValidateService {
	constructor(private readonly api: ApiService, private readonly modalService: NzModalService) {}

	validate(role: string, callback: () => void, error: () => void = () => {}, showModal: boolean = true) {
		this.api.post('/permissoes/validar', { permissao: role }).subscribe({
			next: (data: any) => {
				if (data.cargos.length || data.usuarios.length) {
					callback();
				} else {
					error();
					if (showModal)
						this.modalService.error({
							nzTitle: 'Acesso negado',
							nzContent: data.message,
						});
				}
			},
			error: (err: any) => {
				error();
				this.modalService.error({
					nzTitle: 'Acesso negado',
					nzContent: 'Erro ao validar permissão',
				});
			},
		});
	}

	validateWithoutModal(role: string, callback: () => void, error: () => void = () => {}) {
		this.api.post('/permissoes/validar', { permissao: role }).subscribe({
			next: (data: any) => {
				if (data.cargos.length || data.usuarios.length) {
					callback();
				} else {
					error();
				}
			},
			error: (err: any) => {
				error();
				this.modalService.error({
					nzTitle: 'Acesso negado',
					nzContent: 'Erro ao validar permissão',
				});
			},
		});
	}

	async validateMany(roles: string[], callback: () => void, error: () => void = () => {}) {
		let valid = true;
		let message = '';
		await Promise.all(
			roles.map(
				async (role) =>
					await new Promise((resolve) => {
						this.api.post('/permissoes/validar', { permissao: role }).subscribe({
							next: (data: any) => {
								if (data.cargos.length || data.usuarios.length) {
									valid = valid && true;
									resolve(true);
								} else {
									valid = valid && false;
									message += data.message + '<br>';
									resolve(true);
								}
							},
							error: (err: any) => {
								valid = false;
								message += 'Erro ao validar permissão <br>';
								resolve(true);
							},
						});
					}),
			),
		);

		if (valid) {
			callback();
		} else {
			error();
			this.modalService.error({
				nzTitle: 'Acesso negado',
				nzContent: message != '' ? message : 'Erro ao validar permissão',
			});
		}
	}

	async validateManyWithoutModal(roles: string[], callback: (...args: any) => void, error: () => void = () => {}) {
		let valid = true;
		await Promise.all(
			roles.map(
				async (role) =>
					await new Promise((resolve) => {
						this.api.post('/permissoes/validar', { permissao: role }).subscribe({
							next: (data: any) => {
								if (data.cargos.length || data.usuarios.length) {
									valid = valid && true;
									resolve(true);
								} else {
									valid = valid && false;
									resolve(true);
								}
							},
							error: (err: any) => {
								valid = false;
								resolve(true);
							},
						});
					}),
			),
		);

		if (valid) {
			callback();
		} else {
			error();
		}
	}
}
