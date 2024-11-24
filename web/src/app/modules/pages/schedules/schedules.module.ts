import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchedulesRoutingModule } from './schedules-routing.module';
import { SchedulesCreateComponent } from './schedules-create/schedules-create.component';
import { NgZorroModule } from 'src/app/shared/ng-zorro.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SchedulesComponent } from './schedules.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [SchedulesComponent, SchedulesCreateComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroModule,
    SchedulesRoutingModule,
    SharedModule,
  ],
})
export class SchedulesModule {}
