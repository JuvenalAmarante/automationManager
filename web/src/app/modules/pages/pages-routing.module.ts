import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';

const routes: Routes = [
	{
		path: '',
		component: PagesComponent,
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'home' },
			{
				path: 'home',
				loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
			},
			{
				path: 'usuarios',
				loadChildren: () => import('./users/users.module').then((m) => m.UsersModule),
			},
			{
				path: 'automacoes',
				loadChildren: () => import('./automations/automations.module').then((m) => m.AutomationsModule),
			},
			{
				path: 'agendamentos',
				loadChildren: () => import('./schedules/schedules.module').then((m) => m.SchedulesModule),
			}
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PagesRoutingModule {}
