import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { PermissionValidateService } from 'src/app/core/services/permission-validate.service';
import { CreateCustomFieldsComponent } from 'src/app/modules/pages/custom-forms/create-custom-fields/create-custom-fields.component';
import { PermissaoEnum } from 'src/app/shared/enums/permissions';
import { CampoPersonalizado, DefaultResponse } from 'src/app/shared/types';

@Component({
	selector: 'app-custom-fields',
	templateUrl: './custom-fields.component.html',
	styleUrl: './custom-fields.component.less',
})
export class CustomFieldsComponent implements OnInit {
	isLoading = false;
	validateForm!: FormGroup;
	indexPage: number = 1;
	page: { [key: number]: CampoPersonalizado[] } = {};
	total: number = 0;

	constructor(
		private readonly api: ApiService,
		private readonly permissionService: PermissionValidateService,
		private readonly modalService: NzModalService,
	) {}
	ngOnInit(): void {
		this.getCustomFieldsList();
	}

	showModal(customField?: CampoPersonalizado): void {
		this.permissionService.validate(customField ? PermissaoEnum.AtualizarDadosCampoPersonalizado : PermissaoEnum.CadastrarCampoPersonalizado, () => {
			this.modalService
				.create({
					nzContent: CreateCustomFieldsComponent,
					nzTitle: customField ? 'Editar campo personalizado' : 'Novo campo personalizado',
					nzData: {
						isModal: true,
						custom_field_id: customField?.id,
					},
					nzWidth: '50%',

					nzOkText: customField ? 'Atualizar' : 'Cadastrar',
				})
				.afterClose.subscribe((res) => {
					this.getCustomFieldsList();
				});
		});
	}

	getCustomFieldsList(page: number = this.indexPage) {
		this.isLoading = true;

		this.api
			.post('/custom-fields/list?page=' + page, { page: this.indexPage })
			.pipe(finalize(() => (this.isLoading = false)))
			.subscribe({
				next: (res: DefaultResponse<CampoPersonalizado[]>) => {
					this.page[this.indexPage] = res.data;
					this.total = res.total || 0;
				},
			});
	}

	removeCustomField(id: number) {
		this.api.delete(`/custom-fields/${id}`).subscribe({
			next: (res: DefaultResponse<null>) => {
				this.getCustomFieldsList();
			},
		});
	}

	paginate(index: number) {
		if (!this.page[index] && !this.page[index]?.length) {
			this.getCustomFieldsList(index);
		} else {
			this.indexPage = index;
		}
	}
}
