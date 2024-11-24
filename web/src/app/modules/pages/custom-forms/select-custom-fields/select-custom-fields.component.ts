import { Component, OnInit, inject } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { CampoPersonalizado, DefaultResponse } from 'src/app/shared/types';
import { CreateCustomFieldsComponent } from '../create-custom-fields/create-custom-fields.component';
import { PermissaoEnum } from 'src/app/shared/enums/permissions';
import { PermissionValidateService } from 'src/app/core/services/permission-validate.service';

@Component({
	selector: 'app-select-custom-fields',
	templateUrl: './select-custom-fields.component.html',
	styleUrl: './select-custom-fields.component.less',
})
export class SelectCustomFieldsComponent implements OnInit {
	nzData: { isModal: boolean; custom_form_id?: number } = inject(NZ_MODAL_DATA);
	allChecked: boolean = false;
	listChecked: number[] = [];
	isAccept = false;
	indeterminate = false;
	indexPage: number = 1;
	isLoading = false;
	page: { [key: number]: CampoPersonalizado[] } = {};
	errorList: string[] = [];

	constructor(
		private readonly api: ApiService,
		private readonly nzModalRef: NzModalRef,
		private readonly permissionService: PermissionValidateService,
		private readonly modalService: NzModalService,
	) {
		this.nzModalRef.updateConfig({
			nzOkDisabled: this.listChecked.length === 0,
			nzOnOk: () => this.addCustomFields(),
		});
	}

	ngOnInit(): void {
		this.getCustomFieldsList();
	}

	addCustomFields() {
		const campos_personalizados_ids = this.page[this.indexPage].filter((value) => value.checked).map((value) => value.id);
		return new Promise<boolean>((resolve, reject) => {
			this.api.post(`/custom-forms/${this.nzData.custom_form_id}/add-custom-field`, { campos_personalizados_ids }).subscribe({
				next: (res: DefaultResponse<null>) => {
					this.nzData.isModal && this.nzModalRef.close();
					resolve(true);
				},
				error: (error) => {
					if (Array.isArray(error.error.message)) this.errorList = error.error.message;
					reject(false);
				},
			});
		});
	}

	refreshStatus(id?: number, checked?: boolean): void {
		if (id) {
			if (!this.listChecked.includes(id) && checked) this.listChecked.push(id);

			if (this.listChecked.includes(id) && !checked) {
				const index = this.listChecked.indexOf(id);

				if (index > -1) this.listChecked.splice(index, 1);
			}
		}

		const allChecked = this.page[this.indexPage].length > 0 && this.page[this.indexPage].every((value) => value.checked === true);

		const allUnChecked = this.page[this.indexPage].every((value) => !value.checked);

		this.allChecked = allChecked;
		this.indeterminate = !allChecked && !allUnChecked;

		this.nzModalRef.updateConfig({
			nzOkDisabled: this.listChecked.length === 0,
		});
	}

	checkAll(value: boolean): void {
		this.page[this.indexPage].forEach((data) => {
			data.checked = value;
		});

		this.refreshStatus();
	}

	getCustomFieldsList(page: number = this.indexPage) {
		this.isLoading = true;

		this.api
			.post(`/custom-fields/list/${this.nzData.custom_form_id}/active?page=${page}`, { page: this.indexPage })
			.pipe(finalize(() => (this.isLoading = false)))
			.subscribe({
				next: (res: DefaultResponse<CampoPersonalizado[]>) => {
					this.page[this.indexPage] = res.data;
				},
			});
	}

	showModalAddField(): void {
		this.permissionService.validate(PermissaoEnum.CadastrarCampoPersonalizado, () => {
			this.modalService
				.create({
					nzContent: CreateCustomFieldsComponent,
					nzTitle: 'Novo campo personalizado',

					nzWidth: '50%',

					nzOkText: 'Cadastrar',
				})
				.afterClose.subscribe((res) => {
					this.getCustomFieldsList();
				});
		});
	}
}
