import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { normalizeParams } from 'src/app/shared/helpers';
import { Cargo, DefaultResponse } from 'src/app/shared/types';

@Component({
	selector: 'app-ocupations-create',
	templateUrl: './ocupations-create.component.html',
	styleUrls: ['./ocupations-create.component.less'],
})
export class OcupationsCreateComponent implements OnInit {
	ocupationForm: FormGroup;
	isSaving = false;
	nzData: { isModal: boolean; ocupation: Cargo } = inject(NZ_MODAL_DATA);
	modalRef: NzModalRef = inject(NzModalRef);

	constructor(private readonly fb: UntypedFormBuilder, private readonly api: ApiService) {
		this.ocupationForm = this.fb.group({
			nome: [null, [Validators.required]],
			perfil: [1, [Validators.required]],
			ativo: [true],
		});
	}

	ngOnInit(): void {
		if (this.nzData.ocupation) {
			this.ocupationForm.patchValue({ ...this.nzData.ocupation });
		}
	}

	async handleSubmit() {
		if (this.nzData.ocupation) {
			this.updateOcupation();
			return;
		}
		this.createOcupation();
	}

	createOcupation(): void {
		this.isSaving = true;
		this.api
			.post('/ocupations', normalizeParams(this.ocupationForm.value))
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

	updateOcupation() {
		this.isSaving = false;
		this.api
			.patch(`/ocupations/${this.nzData.ocupation.id}`, this.ocupationForm.value)
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
}
