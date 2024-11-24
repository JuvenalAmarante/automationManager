import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AutomationsRoutingModule } from './automations-routing.module';
import { AutomationsCreateComponent } from './automations-create/automations-create.component';
import { NgZorroModule } from 'src/app/shared/ng-zorro.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutomationsComponent } from './automations.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AutomationsComponent, AutomationsCreateComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroModule,
    AutomationsRoutingModule,
    SharedModule,
  ],
})
export class AutomationsModule {}
