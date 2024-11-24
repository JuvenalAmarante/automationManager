import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/core/services/api.service';
import { DefaultResponse, Filial } from 'src/app/shared/types';
import { normalizeParams } from 'src/app/shared/helpers';
import { finalize } from 'rxjs';
import { NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
	selector: 'app-automations-create',
	templateUrl: './automations-create.component.html',
	styleUrls: ['./automations-create.component.less'],
})
export class AutomationsCreateComponent {
	automationForm: FormGroup;
	isSaving = false;
	fileList: NzUploadFile[] = [];
	errorList: string[] = [];

	nzData: { isModal: boolean; automation_id: number } = inject(NZ_MODAL_DATA);
	modalRef: NzModalRef = inject(NzModalRef);

	constructor(private readonly fb: UntypedFormBuilder, private readonly api: ApiService) {
		this.automationForm = this.fb.group({
			nome: [null, [Validators.required]],
			arquivo: [null, [Validators.required]],
		});
	}

	async handleSubmit() {
		this.createAutomation();
	}

	beforeUpload = (file: NzUploadFile): boolean => {
		this.automationForm.patchValue({ arquivo: file });
		this.fileList = [file];

		return false;
	};

	createAutomation(): void {
		this.isSaving = true;
		this.api
			.post('/automacoes', normalizeParams(this.automationForm.value), true)
			.pipe(
				finalize(() => {
					this.isSaving = false;
				}),
			)
			.subscribe({
				next: (res: DefaultResponse<null | undefined>) => {
					this.modalRef.close();
				},
			});
	}

	closeErrorAlert(error: string) {
		this.errorList = this.errorList.filter((err) => err !== error);
	}
}
