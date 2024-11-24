import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { catchError, finalize, of } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { normalizeParams } from 'src/app/shared/helpers';
import { DefaultResponse } from 'src/app/shared/types';

@Component({
  selector: 'app-document-type-create',
  templateUrl: './document-type-create.component.html',
  styleUrls: ['./document-type-create.component.less'],
})
export class DocumentTypeCreateComponent implements OnInit {
  nzData: { isModal: boolean; document_type_id: number } =
    inject(NZ_MODAL_DATA);
  modalRef: NzModalRef = inject(NzModalRef);
  documentTypeForm: any;
  errorList: any;
  isSaving = false;

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly api: ApiService
  ) {
    this.documentTypeForm = this.fb.group({
      nome: [null, [Validators.required]],
      ativo: [true],
    });
  }
  ngOnInit(): void {
    if (this.nzData.document_type_id) {
      this.getDocumentType();
    }
  }

  getDocumentType() {
    this.api
      .get(`/document-type/${this.nzData.document_type_id}`)
      .subscribe((res) => {
        this.documentTypeForm.patchValue(res.data);
      });
  }

  handleSubmit() {
    if (this.nzData.document_type_id) {
      this.updateDocumentType();
      return;
    }
    this.createDocumentType();
  }
  createDocumentType() {
    this.isSaving = true;
    this.api
      .post('/document-type', normalizeParams(this.documentTypeForm.value))
      .pipe(
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe({
        next: (res: DefaultResponse<null | undefined>) => {
          this.modalRef.close();
        },
        error: (err: HttpErrorResponse) => {
          if (Array.isArray(err.error.message))
            this.errorList = err.error.message;
          else this.errorList = [err.error.message];
        },
      });
  }

  updateDocumentType() {
    this.isSaving = true;
    this.api
      .patch(
        `/document-type/${this.nzData.document_type_id}`,
        this.documentTypeForm.value
      )
      .pipe(
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe({
        next: (res: DefaultResponse<null | undefined>) => {
          this.modalRef.close();
        },
        error: (err: HttpErrorResponse) => {
          if (Array.isArray(err.error.message))
            this.errorList = err.error.message;
          else this.errorList = [err.error.message];
        },
      });
  }
  closeErrorAlert(error: string) {
    this.errorList = this.errorList.filter((err: string) => err !== error);
  }
}
