import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './modules/not-found/not-found.component';

const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'app' },
	{ path: 'login', loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule) },
	{ path: 'app', loadChildren: () => import('./modules/pages/pages.module').then((m) => m.PagesModule) },
	{ path: '404', component: NotFoundComponent },
	{ path: '**', pathMatch: 'full', redirectTo: '404' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
