import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchedulesRoutingModule } from './schedules-routing.module';
import { SchedulesCreateComponent } from './schedules-create/schedules-create.component';
import { NgZorroModule } from 'src/app/shared/ng-zorro.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SchedulesComponent } from './schedules.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SchedulesQueueComponent } from './schedules-queue/schedules-queue.component';
import { SchedulesLogComponent } from './schedules-log/schedules-log.component';

@NgModule({
  declarations: [SchedulesComponent, SchedulesCreateComponent, SchedulesQueueComponent, SchedulesLogComponent],
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
