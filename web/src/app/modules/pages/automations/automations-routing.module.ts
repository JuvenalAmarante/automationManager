import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutomationsComponent } from './automations.component';
import { AutomationsCreateComponent } from './automations-create/automations-create.component';
import { AdminAuthGuard } from 'src/app/core/guards/admin-auth.guard';

const routes: Routes = [
  {
    path: '',
     component: AutomationsComponent,
     canActivate: [AdminAuthGuard],
  },
  {
    path: 'criar',
    component: AutomationsCreateComponent,
    canActivate: [AdminAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutomationsRoutingModule { }
