import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { ApiParams, GetParams } from 'src/app/shared/types';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class ApiService {
	private baseURL = environment.apiUrl;

	constructor(private readonly http: HttpClient) {}

	get(path: string, params?: GetParams): Observable<any> {
		return this.http
			.get(`${this.baseURL + path}`, {
				params,
			})
			.pipe(take(1));
	}

	post(path: string, params: ApiParams, isFormdata = false): Observable<any> {
		return this.http
			.post(
				`${this.baseURL + path}`,
				params,
				isFormdata
					? {
							headers: new HttpHeaders({
								'Content-Type': 'multipart/form-data',
							}),
					  }
					: undefined,
			)
			.pipe(take(1));
	}

	put(path: string, params: ApiParams): Observable<any> {
		return this.http.put(`${this.baseURL + path}`, params).pipe(take(1));
	}

	patch(path: string, params: ApiParams): Observable<any> {
		return this.http.patch(`${this.baseURL + path}`, params).pipe(take(1));
	}

	delete(path: string): Observable<any> {
		return this.http.delete(`${this.baseURL + path}`).pipe(take(1));
	}
}
