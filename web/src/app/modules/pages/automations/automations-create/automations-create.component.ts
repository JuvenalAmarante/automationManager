import { Component } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { DefaultResponse } from 'src/app/shared/types';
import { normalizeParams } from 'src/app/shared/helpers';
import { finalize } from 'rxjs';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Router } from '@angular/router';

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

	constructor(private readonly fb: UntypedFormBuilder, private readonly api: ApiService, private readonly router: Router) {
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
		const form = new FormData();

		form.append('nome', this.automationForm.value.nome);
		form.append('arquivo', this.automationForm.value.arquivo);

		this.api
			.post('/automacoes', form)
			.pipe(
				finalize(() => {
					this.isSaving = false;
				}),
			)
			.subscribe({
				next: (res: DefaultResponse<null | undefined>) => {
					this.goBack();
				},
			});
	}

	goBack() {
		this.router.navigate(['/app/automacoes']);
	}

	closeErrorAlert(error: string) {
		this.errorList = this.errorList.filter((err) => err !== error);
	}
}
