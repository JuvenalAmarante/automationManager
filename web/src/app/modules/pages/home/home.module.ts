import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NgZorroModule } from 'src/app/shared/ng-zorro.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
	declarations: [HomeComponent],
	imports: [CommonModule, HomeRoutingModule, NgZorroModule, FormsModule, NgApexchartsModule, SharedModule],
})
export class HomeModule {}
