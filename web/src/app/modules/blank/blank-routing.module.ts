import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RocketchatComponent } from './rocketchat/rocketchat.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
	{
		path: '',
		component: RocketchatComponent,
		canActivate: [AuthGuard],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class BlankRoutingModule {}
