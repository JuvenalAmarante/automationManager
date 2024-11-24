import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OcupationsComponent } from './ocupations.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { PermissaoEnum } from 'src/app/shared/enums/permissions';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'buscar' },
  {
    path: 'buscar',
    component: OcupationsComponent,
    data: { role: PermissaoEnum.CargosListar },
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OcupationsRoutingModule { }
