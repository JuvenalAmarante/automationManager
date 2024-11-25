import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeModule } from './home/home.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { NgZorroModule } from 'src/app/shared/ng-zorro.module';

import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

const config: SocketIoConfig = {
	url: environment.socketUrl,
	options: {
		path: '/socket.io/',
		transportOptions: {
			polling: {
				extraHeaders: {
					Authorization: `Bearer ${localStorage.getItem('access_token')}`,
				},
			},
		},
	},
};

@NgModule({
	declarations: [PagesComponent],
	imports: [
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		PagesRoutingModule,
		NgZorroModule,
		HomeModule,
		SocketIoModule.forRoot(config),
	],
})
export class PagesModule {}
