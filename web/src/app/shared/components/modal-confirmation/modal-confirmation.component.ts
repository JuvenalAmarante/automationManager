import { Component, Input, OnInit, inject } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
	selector: 'app-modal-confirmation',
	templateUrl: './modal-confirmation.component.html',
	styleUrls: ['./modal-confirmation.component.less'],
})
export class ModalConfirmationComponent implements OnInit {
	nzData: { isModal: boolean; label: string; label_title: string; minLength: number; placeholder: string; value: string } = inject(NZ_MODAL_DATA);
	modalRef: NzModalRef = inject(NzModalRef);

	ngOnInit(): void {}

	updateValidity() {
		this.modalRef.updateConfig({ nzOkDisabled: this.nzData.value?.length < this.nzData.minLength });
	}
}
