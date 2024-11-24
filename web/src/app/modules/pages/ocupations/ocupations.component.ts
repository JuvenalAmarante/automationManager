import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { normalizeParams } from 'src/app/shared/helpers';
import { Cargo, DefaultResponse } from 'src/app/shared/types';
import { OcupationsCreateComponent } from './ocupations-create/ocupations-create.component';
import { PermissionValidateService } from 'src/app/core/services/permission-validate.service';

@Component({
  selector: 'app-ocupations',
  templateUrl: './ocupations.component.html',
  styleUrls: ['./ocupations.component.less'],
})
export class OcupationsComponent {
  isLoading = false;
  validateForm!: FormGroup;
  dataList!: Cargo[];

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: ApiService,
    private readonly modalService: NzModalService,
    private readonly permissionService: PermissionValidateService
  ) {
    this.validateForm = fb.group({
      busca: [null],
    });
  }

  ngOnInit(): void {
    this.getOcupationsList();
  }

  getFormControlValidationStatus(controlName: string): string {
    const control = this.validateForm.get(controlName);
    return control?.dirty && control?.errors ? 'error' : '';
  }

  showModal(ocupation?: Cargo): void {
    this.permissionService.validate(ocupation ? 'cargos-atualizar-dados' : 'cargos-cadastrar', () => {
      this.modalService
        .create({
          nzContent: OcupationsCreateComponent,
          nzTitle: ocupation ? 'Editar cargo' : 'Novo cargo',
          nzData: {
            isModal: true,
            ocupation,
          },
          nzFooter: null,
        })
        .afterClose.subscribe((res) => {
          this.getOcupationsList();
        });
    });
  }

  getOcupationsList() {
    this.isLoading = true;

    this.api
      .get('/ocupations/list', normalizeParams(this.validateForm.value))
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (res: DefaultResponse<Cargo[]>) => {
          this.dataList = res.data;
        },
      });
  }
}
