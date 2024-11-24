import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable()
export class GuardInterceptor implements HttpInterceptor {
	constructor(private router: Router, private messageService: NzMessageService) {}

	private addToken(request: HttpRequest<any>, token: any) {
		let headers = new HttpHeaders({
			Accept: 'application/json',
		});

		if (token) {
			headers = new HttpHeaders({
				Accept: 'application/json',
				Authorization: `Bearer ${token}`,
			});
		}
		return request.clone({
			headers,
		});
	}

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		let token = localStorage.getItem('access_token') || localStorage.getItem('first_access_token');
		let clonedReq = this.addToken(request, token);

		return next.handle(clonedReq).pipe(
			map((event: HttpEvent<any>) => {
				if (event instanceof HttpResponse) {
					if (event.status === 200 || event.status === 201) {
						if (event.body && event.body?.message && event.url?.indexOf('/permissoes/validar') === -1) {
							this.messageService.remove();
							this.messageService.success(event.body?.message);
						}
					}
				}

				return event;
			}),
			catchError((error: any) => {
				if (error.status != 400 || (this.router.url !== '/login' && error.url?.indexOf('/perfil') !== -1)) {
					this.messageService.remove();
					this.messageService.warning(error.error.message);
				}

				if (error.status == 401) {
					this.router.navigateByUrl('/login');
					localStorage.removeItem('access_token');
					localStorage.removeItem('first_access_token');
				}

				if (error.status == 500) {
					this.messageService.remove();
					this.messageService.error('Houve um erro inesperado!');
				}

				return throwError(error);
			}),
		);
	}
}
