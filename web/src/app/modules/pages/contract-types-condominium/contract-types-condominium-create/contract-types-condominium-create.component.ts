import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { normalizeParams } from 'src/app/shared/helpers';
import { DefaultResponse, TipoContrato } from 'src/app/shared/types';

@Component({
  selector: 'app-contract-types-condominium-create',
  templateUrl: './contract-types-condominium-create.component.html',
  styleUrls: ['./contract-types-condominium-create.component.less'],
})
export class ContractTypesCondominiumCreateComponent implements OnInit {
  isSaving: boolean = false;
  contractTypesForm!: FormGroup;
  nzData: { isModal: boolean; tipo_contrato_id: number } =
    inject(NZ_MODAL_DATA);
  modalRef: NzModalRef = inject(NzModalRef);

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly api: ApiService
  ) {
    this.contractTypesForm = this.fb.group({
      nome: ['', [Validators.required]],
      ativo: [true, [Validators.required]],
    });
  }

  ngOnInit() {
    if (this.nzData.tipo_contrato_id) {
      this.getContractTypeDetail();
    }
  }

  handleSubmit(values: { ativo: boolean; nome: string }) {
    if (this.nzData.tipo_contrato_id) {
      this.updateTipoContrato(values);
      return;
    }
    this.createTipoContrato(values);
  }

  createTipoContrato(values: { ativo: boolean; nome: string }) {
    this.isSaving = true;
    this.api
      .post('/contract-types-condominium', normalizeParams(values))
      .pipe(
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe({
        next: (res: DefaultResponse<null>) => {
          this.modalRef.close();
        },
      });
  }

  updateTipoContrato(values: { ativo: boolean; nome: string }) {
    this.api
      .patch(
        `/contract-types-condominium/${this.nzData.tipo_contrato_id}`,
        values
      )
      .subscribe({
        next: (res: DefaultResponse<null>) => {
          this.modalRef.close();
        },
      });
  }

  getContractTypeDetail() {
    this.api
      .get(`/contract-types-condominium/${this.nzData.tipo_contrato_id}`)
      .subscribe({
        next: (res: DefaultResponse<TipoContrato>) => {
          this.contractTypesForm.patchValue(res.data);
        },
      });
  }
}
