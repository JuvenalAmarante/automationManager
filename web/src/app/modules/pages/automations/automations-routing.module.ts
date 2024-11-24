import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutomationsComponent } from './automations.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { PermissaoEnum } from 'src/app/shared/enums/permissions';

const routes: Routes = [
  {
    path: '', pathMatch: 'full', redirectTo: 'buscar',
  },
  {
    path: 'buscar',
    component: AutomationsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutomationsRoutingModule { }
