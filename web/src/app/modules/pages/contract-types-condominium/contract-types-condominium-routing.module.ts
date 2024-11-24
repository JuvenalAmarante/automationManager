import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractTypesCondominiumComponent } from './contract-types-condominium.component';
import { PermissaoEnum } from 'src/app/shared/enums/permissions';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'buscar',
  },
  {
    path: 'buscar',
    component: ContractTypesCondominiumComponent,
    data: { role: PermissaoEnum.ListarTiposContrato },
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractTypesCondominiumRoutingModule {}
