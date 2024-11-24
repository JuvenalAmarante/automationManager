import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { ApiService } from '../services/api.service';
import { NzModalService } from 'ng-zorro-antd/modal';

@Injectable({
	providedIn: 'root',
})
export class AdminAuthGuard {
	constructor(
		private api: ApiService,
		private readonly modalService: NzModalService,
		private readonly router: Router,
	) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
		return new Promise((resolve) => {
				this.api.get('/perfil').subscribe({
					next: async (res) => {
						if (!res.data.admin) {
								this.modalService
									.error({
										nzTitle: 'Acesso negado',
										nzContent: 'Acesso a esta funcionalidade bloqueado.',
										nzOnOk: () => this.router.navigate(['/app']),
									})
									.afterClose.subscribe((d) => this.router.navigate(['/app']));
								resolve(false);
						}
						resolve(true);
					},
					error: (err) => resolve(false),
				});
			});
	}
}
