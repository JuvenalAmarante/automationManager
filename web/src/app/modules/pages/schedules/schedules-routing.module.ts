import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchedulesComponent } from './schedules.component';
import { SchedulesCreateComponent } from './schedules-create/schedules-create.component';

const routes: Routes = [
	{
		path: '',
		component: SchedulesComponent,
	},
	{
		path: 'criar',
		component: SchedulesCreateComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SchedulesRoutingModule {}
