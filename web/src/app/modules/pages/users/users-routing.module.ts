import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { PermissaoEnum } from 'src/app/shared/enums/permissions';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    data: { role: PermissaoEnum.ListarTodosUsuarios },
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule { }
