import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { PermissionValidateService } from 'src/app/core/services/permission-validate.service';
import { DefaultResponse, FormularioPersonalizado } from 'src/app/shared/types';

@Component({
	selector: 'app-custom-forms',
	templateUrl: './custom-forms.component.html',
	styleUrl: './custom-forms.component.less',
})
export class CustomFormsComponent {
	isLoading = false;
	validateForm!: FormGroup;
	indexPage: number = 1;
	page: { [key: number]: FormularioPersonalizado[] } = {};
	total: number = 0;

	constructor(
		private readonly api: ApiService,
		private readonly permissionService: PermissionValidateService,
		private readonly fb: FormBuilder,
		private readonly modalService: NzModalService,
	) {
		this.validateForm = fb.group({
			nome: [null],
			chave: [null],
		});
	}

	ngOnInit(): void {
		this.getFormsList();
	}

	getFormsList(page: number = this.indexPage) {
		this.isLoading = true;
		this.api
			.post('/custom-forms/list?page=' + page, {})
			.pipe(finalize(() => (this.isLoading = false)))
			.subscribe({
				next: (res: DefaultResponse<FormularioPersonalizado[]>) => {
					this.page[this.indexPage] = res.data;
					this.total = res.total || 0;
				},
			});
	}

	removeCustomForm(custom_form_id: number) {
		this.isLoading = true;
		this.api
			.delete('/custom-forms/' + custom_form_id)
			.pipe(finalize(() => (this.isLoading = false)))
			.subscribe({
				next: (res: DefaultResponse<null>) => {
					this.getFormsList();
				},
			});
	}

	paginate(index: number) {
		if (!this.page[index] && !this.page[index]?.length) {
			this.getFormsList(index);
		} else {
			this.indexPage = index;
		}
	}
}
