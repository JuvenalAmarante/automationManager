import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeModule } from './home/home.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { NgZorroModule } from 'src/app/shared/ng-zorro.module';
import { DocumentsModule } from './documents/documents.module';
import { ContractTypesCondominiumModule } from './contract-types-condominium/contract-types-condominium.module';

import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { CustomFormsModule } from './custom-forms/custom-forms.module';

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
		ContractTypesCondominiumModule,
		DocumentsModule,
		SocketIoModule.forRoot(config),
		CustomFormsModule,
	],
})
export class PagesModule {}
