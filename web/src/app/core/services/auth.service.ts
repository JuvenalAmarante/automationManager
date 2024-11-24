import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { DefaultResponse } from 'src/app/shared/types';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private readonly apiUrl = environment.apiUrl;

	constructor(private readonly http: HttpClient) {}

	authenticate(params: { usuario: string; senha: string }): Observable<any> {
		const headers = new HttpHeaders({
			'Content-Type': 'application/json',
			Accept: 'application/json',
		});
		return this.http.post<DefaultResponse<any> | HttpErrorResponse>(`${this.apiUrl}/login`, params, { headers }).pipe(take(1));
	}

	isAuthenticated(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.http
				.get(`${this.apiUrl}/perfil`)
				.pipe(take(1))
				.subscribe({
					next: (response) => {
						resolve(true);
					},
					error: (err) => {
						localStorage.removeItem('access_token');

						reject(false);
					},
				});
		});
	}
}
