import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HomeModule } from './home/home.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { NgZorroModule } from 'src/app/shared/ng-zorro.module';

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
	],
})
export class PagesModule {}
