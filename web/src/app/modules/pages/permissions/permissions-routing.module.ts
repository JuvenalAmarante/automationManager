import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsComponent } from './permissions.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { PermissaoEnum } from 'src/app/shared/enums/permissions';

const routes: Routes = [
  {
    path: '',
    component: PermissionsComponent,
    data: { role: PermissaoEnum.ListarPermissoes },
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PermissionsRoutingModule { }
