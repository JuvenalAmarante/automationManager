import { NzModalService } from 'ng-zorro-antd/modal';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { PermissionValidateService } from 'src/app/core/services/permission-validate.service';
import { DefaultResponse, TipoContrato } from 'src/app/shared/types';
import { ContractTypesCondominiumCreateComponent } from './contract-types-condominium-create/contract-types-condominium-create.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-contract-types-condominium',
  templateUrl: './contract-types-condominium.component.html',
  styleUrls: ['./contract-types-condominium.component.less'],
})
export class ContractTypesCondominiumComponent implements OnInit {
  isLoading: boolean = false;
  tiposContrato: TipoContrato[] = [];
  totalRegistros: number = 1;
  page: any;

  constructor(
    private readonly permissionService: PermissionValidateService,
    private readonly api: ApiService,
    private readonly modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.getContractTypes();
  }

  showCreateModal(tipo_contrato_id?: number) {
    const permission = tipo_contrato_id
      ? ['tipo-contrato-atualizar', 'tipo-contrato-exibir-dados']
      : ['tipo-contrato-cadastrar'];
    this.permissionService.validateMany(permission, () => {
      this.modalService
        .create({
          nzContent: ContractTypesCondominiumCreateComponent,
          nzTitle: tipo_contrato_id
            ? 'Editar tipo de contrato'
            : 'Novo tipo de contrato',
          nzData: {
            isModal: true,
            tipo_contrato_id,
          },
          nzFooter: null,
        })
        .afterClose.subscribe((res) => {
          this.getContractTypes();
        });
    });
  }

  getContractTypes(page?: number) {
    this.isLoading = true;
    this.api
      .post(`/contract-types-condominium/list?page=${page}`, {})
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (res: DefaultResponse<TipoContrato[]>) => {
          this.tiposContrato = res.data;
          this.totalRegistros = res?.total_pages || 1;
        },
      });
  }

  paginate(index: number) {
    this.getContractTypes(index);
  }
}
