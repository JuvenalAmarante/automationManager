import { Component, inject, OnInit } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { TransferItem, TransferDirection } from 'ng-zorro-antd/transfer';
import { finalize } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { Automacao, DefaultResponse } from 'src/app/shared/types';

@Component({
	selector: 'app-users-automation',
	templateUrl: './users-automation.component.html',
	styleUrls: ['./users-automation.component.less'],
})
export class UsersAutomationComponent implements OnInit {
	isLoading = false;

	nzData: { userId: number } = inject(NZ_MODAL_DATA);
	modalRef: NzModalRef = inject(NzModalRef);

	automationsList: TransferItem[] = [];

	automationsListSelected: number[] = []

	errorList: string[] = [];

	constructor(private readonly api: ApiService) {
		this.modalRef.updateConfig({
			nzOnOk: async () => await this.submitForm(),
		});
	}

	ngOnInit(): void {
		this.loadUserAutomations();
	}

	loadAutomations() {
		this.isLoading = true;
		this.api
			.get(`/automacoes`)
			.pipe(
				finalize(() => {
					this.isLoading = false;
				}),
			)
			.subscribe({
				next: (res: DefaultResponse<Automacao[]>) => {
					this.automationsList = res.data.map((automation) => ({
						key: automation.id,
						value: automation.id,
						title: automation.nome,
						direction: this.automationsListSelected.includes(automation.id) ? 'right' : 'left'
					}));
				},
			});
	}

	loadUserAutomations() {
		this.isLoading = true;
		this.api
			.get(`/usuarios/${this.nzData.userId}/automacoes`)
			.pipe(
				finalize(() => {
					this.isLoading = false;
				}),
			)
			.subscribe({
				next: (res: DefaultResponse<number[]>) => {
					this.automationsListSelected = res.data;

					this.loadAutomations()
				},
			});
	}

	submitForm() {
		return new Promise((res, rej) => {
			this.api
				.put(`/usuarios/${this.nzData.userId}/automacoes`, {
					automacoes_ids: this.automationsList.filter((item) => item.direction == 'right').map((item) => item['value']),
				})
				.subscribe({
					next: () => {
						res(true);
					},
					error: (res) => {
						if (Array.isArray(res.error.message)) this.errorList = res.error.message;
						else this.errorList = [res.error.message];
						rej(false);
					},
				});
		});
	}

	closeErrorAlert(error: string) {
		this.errorList = this.errorList.filter((err) => err !== error);
	}

	closeModal() {
		this.modalRef.close();
	}
}
