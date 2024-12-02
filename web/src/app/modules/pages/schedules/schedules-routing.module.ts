import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchedulesComponent } from './schedules.component';
import { SchedulesCreateComponent } from './schedules-create/schedules-create.component';
import { SchedulesQueueComponent } from './schedules-queue/schedules-queue.component';
import { SchedulesLogComponent } from './schedules-log/schedules-log.component';

const routes: Routes = [
	{
		path: '',
		component: SchedulesComponent,
	},
	{
		path: 'fila',
		component: SchedulesQueueComponent,
	},
	{
		path: 'criar',
		component: SchedulesCreateComponent,
	},
	{
		path: 'editar/:id',
		component: SchedulesCreateComponent,
	},
	{
		path: 'logs/:id',
		component: SchedulesLogComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SchedulesRoutingModule {}
