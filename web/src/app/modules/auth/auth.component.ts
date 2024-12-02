import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from 'src/app/core/services/auth.service';
import { DefaultResponse } from 'src/app/shared/types';
@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.less'],
})
export class AuthComponent implements OnInit {
	validateForm: UntypedFormGroup;
	passwordVisible = false;
	isLogging = false;
	constructor(
		private readonly fb: UntypedFormBuilder,
		private readonly authServices: AuthService,
		private readonly router: Router,
		private readonly messageService: NzMessageService,
	) {
		this.validateForm = this.fb.group({
			usuario: ['', [Validators.required]],
			senha: ['', [Validators.required]],
		});
	}

	async ngOnInit() {
		if (localStorage.getItem('access_token')) {
			if (await this.authServices.isAuthenticated()) this.router.navigate(['/app']);
			else localStorage.removeItem('access_token');
		}
	}

	login() {
		this.isLogging = true;
		this.authServices.authenticate(this.validateForm.value).subscribe({
			next: (res: DefaultResponse<any>) => {
				if (res.data.token.length > 0) {
					localStorage.setItem('access_token', res.data.token);
					this.router.navigate(['/app']);
					this.isLogging = false;
				}
			},
			error: (err) => {
				this.messageService.error(err.error.message);
				this.isLogging = false;
			},
		});
	}
}
