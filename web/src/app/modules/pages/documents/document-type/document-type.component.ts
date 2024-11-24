import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { PermissionValidateService } from 'src/app/core/services/permission-validate.service';
import { DefaultResponse, DocumentTypes } from 'src/app/shared/types';
import { DocumentTypeCreateComponent } from '../document-type-create/document-type-create.component';

@Component({
  selector: 'app-document-type',
  templateUrl: './document-type.component.html',
  styleUrls: ['./document-type.component.less'],
})
export class DocumentTypeComponent implements OnInit {
  dataList!: DocumentTypes[];
  isLoading = false;

  constructor(
    private readonly api: ApiService,
    private readonly modalService: NzModalService,
    private readonly permissionService: PermissionValidateService
  ) {}
  ngOnInit(): void {
    this.getDocumentTypes();
  }

  removeDocumentType(id: any) {
    this.api
      .delete(`/document-type/${id}`)
      .pipe(finalize(() => this.getDocumentTypes()))
      .subscribe((res) => {});
  }

  showModal(document_type?: any) {
    this.permissionService.validate(
      document_type
        ? 'tipos-documentos-atualizar'
        : 'tipos-documentos-cadastrar',
      () => {
        this.modalService
          .create({
            nzContent: DocumentTypeCreateComponent,
            nzTitle: document_type
              ? 'Editar tipo de documento'
              : 'Novo tipo de documento',
            nzData: {
              isModal: true,
              document_type_id: document_type?.id,
            },
            nzFooter: null,
          })
          .afterClose.subscribe((res) => {
            this.getDocumentTypes();
          });
      }
    );
  }

  getDocumentTypes() {
    this.isLoading = true;
    this.api
      .get('/document-type/list')
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((res: DefaultResponse<DocumentTypes[]>) => {
        this.dataList = res.data;
      });
  }
}
