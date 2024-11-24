import { Router } from '@angular/router';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { MenuItem, DefaultResponse, Profile } from 'src/app/shared/types';

import { ApiService } from 'src/app/core/services/api.service';

@Component({
	selector: 'app-pages',
	templateUrl: './pages.component.html',
	styleUrls: ['./pages.component.less'],
})
export class PagesComponent implements OnInit {
	isLoading = false;

	isCollapsed = false;
	status!: boolean;
	searchType: number = 1;

	menu: MenuItem[] = [];
	profile?: Profile;
	currentRoute: string = '';

	constructor(private readonly router: Router, private readonly api: ApiService) {}

	ngOnInit(): void {
		this.status = window.navigator.onLine;
		this.getMenu();
		this.getProfile();
	}

	getMenu() {
		this.api.get('/menus').subscribe({
			next: (res: DefaultResponse<MenuItem[]>) => {
				this.menu = res.data.map((item) => ({
					...item,
					isActive: item?.items?.some((i) => i.url.includes(this.currentRoute)),
				}));
			},
		});
	}

	getProfile() {
		this.api.get('/perfil').subscribe({
			next: (
				res: DefaultResponse<Profile>,
			) => {
				this.profile = res.data;

				localStorage.setItem('profileData', JSON.stringify(res.data));
			},
			error: () => {
				localStorage.removeItem('access_token');
			},
		});
	}

	logout() {
		localStorage.removeItem('access_token');
		this.router.navigate(['/login']);
	}
}
