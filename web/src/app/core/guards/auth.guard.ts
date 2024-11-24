import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { ApiService } from '../services/api.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SystemService } from '../services/system.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard {
	constructor(
		private api: ApiService,
		private readonly modalService: NzModalService,
		private readonly router: Router,
		private readonly systemService: SystemService,
	) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
		const action: string = route.data['role'];
		if (action) {
			return new Promise((resolve) => {
				this.api.post('/permissoes/validar', { permissao: action }).subscribe({
					next: async (data) => {
						if (data.cargos.length || data.usuarios.length) {
							resolve(true);
						} else {
							if (route.data['param-system']) {
								const sysParam = await this.systemService.getParam(route.data['param-system']);
								if (sysParam && sysParam.valor != route.data['param-system-value']) {
									this.modalService
										.error({
											nzTitle: 'Acesso negado',
											nzContent: 'Acesso a esta funcionalidade bloqueado.',
											nzOnOk: () => this.router.navigate(['/app']),
										})
										.afterClose.subscribe((d) => this.router.navigate(['/app']));
									resolve(false);
								}
							}

							this.modalService
								.error({
									nzTitle: 'Acesso negado',
									nzContent: data.message,
									nzOnOk: () => this.router.navigate(['/app']),
								})
								.afterClose.subscribe((d) => this.router.navigate(['/app']));
							resolve(false);
						}
					},
					error: (err) => {
						if (err.status != 401)
							this.modalService.error({
								nzTitle: 'Acesso negado',
								nzContent: 'Erro ao validar permissão',
								nzOnOk: () => this.router.navigate(['/app']),
							});
					},
				});
			});
		} else {
			return new Promise((resolve) => {
				this.api.get('/perfil').subscribe({
					next: async (data) => {
						if (route.data['param-system']) {
							const sysParam = await this.systemService.getParam(route.data['param-system']);
							if (sysParam && sysParam.valor != route.data['param-system-value']) {
								this.modalService
									.error({
										nzTitle: 'Acesso negado',
										nzContent: 'Acesso a esta funcionalidade bloqueado.',
										nzOnOk: () => this.router.navigate(['/app']),
									})
									.afterClose.subscribe((d) => this.router.navigate(['/app']));
								resolve(false);
							}
						}
						resolve(true);
					},
					error: (err) => resolve(false),
				});
			});
		}
	}
}
