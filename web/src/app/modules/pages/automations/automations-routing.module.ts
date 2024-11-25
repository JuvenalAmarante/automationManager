import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutomationsComponent } from './automations.component';
import { AutomationsCreateComponent } from './automations-create/automations-create.component';
import { AdminAuthGuard } from 'src/app/core/guards/admin-auth.guard';
import { AutomationsParameterCreateComponent } from './automations-parameter-create/automations-parameter-create.component';

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
	{
		path: 'parametros',
		component: AutomationsParameterCreateComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AutomationsRoutingModule {}
