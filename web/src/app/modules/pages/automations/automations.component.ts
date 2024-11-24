import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { AutomationsCreateComponent } from './automations-create/automations-create.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Automacao, DefaultResponse, Profile } from 'src/app/shared/types';
import { finalize } from 'rxjs';
import { PermissionValidateService } from 'src/app/core/services/permission-validate.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-automations',
	templateUrl: './automations.component.html',
	styleUrls: ['./automations.component.less'],
})
export class AutomationsComponent implements OnInit {
	isLoading = false;
	validateForm!: FormGroup;
	dataList: Automacao[] = [];
	profile?: Profile;

	constructor(
		private readonly api: ApiService,
		private readonly modalService: NzModalService,
		private readonly permissionService: PermissionValidateService,
    private readonly router: Router
	) {}

	ngOnInit(): void {
		this.profile = JSON.parse(localStorage.getItem('profileData') || '{}');
    
    if(!this.profile?.admin) this.router.navigate(['/app']);

		this.getAutomationsList();
	}

	getFormControlValidationStatus(controlName: string): string {
		const control = this.validateForm.get(controlName);
		return control?.dirty && control?.errors ? 'error' : '';
	}

	showModal(department?: Automacao): void {
		this.modalService
			.create({
				nzContent: AutomationsCreateComponent,
				nzTitle: 'Nova automação',
				nzFooter: null,
			})
			.afterClose.subscribe((res) => {
				this.getAutomationsList();
			});
	}

	getAutomationsList(values?: { busca: string; nac: boolean; ativo: boolean }) {
		this.isLoading = true;

		this.api
			.get('/automacoes', values || {})
			.pipe(
				finalize(() => {
					this.isLoading = false;
				}),
			)
			.subscribe({
				next: (res: DefaultResponse<Automacao[]>) => {
					this.dataList = res.data;
				},
			});
	}

	removeAutomation(id: number) {
		this.api
			.delete(`/automacoes/${id}`)
			.pipe(
				finalize(() => {
					this.isLoading = false;
				}),
			)
			.subscribe({
				next: (res: DefaultResponse<undefined | null>) => {
					this.getAutomationsList();
				},
			});
	}
}
