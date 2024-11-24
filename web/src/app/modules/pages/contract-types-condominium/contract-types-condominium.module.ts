import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractTypesCondominiumRoutingModule } from './contract-types-condominium-routing.module';
import { ContractTypesCondominiumComponent } from './contract-types-condominium.component';
import { NgZorroModule } from 'src/app/shared/ng-zorro.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContractTypesCondominiumCreateComponent } from './contract-types-condominium-create/contract-types-condominium-create.component';

@NgModule({
  declarations: [
    ContractTypesCondominiumComponent,
    ContractTypesCondominiumCreateComponent,
  ],
  imports: [
    CommonModule,
    ContractTypesCondominiumRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroModule,
  ],
})
export class ContractTypesCondominiumModule {}
