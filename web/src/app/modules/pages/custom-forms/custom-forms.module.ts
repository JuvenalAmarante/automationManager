import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomFormsRoutingModule } from './custom-forms-routing.module';
import { CustomFieldsComponent } from './custom-fields/custom-fields.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgZorroModule } from 'src/app/shared/ng-zorro.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomFormsComponent } from './custom-forms.component';
import { CreateCustomFormComponent } from './create-custom-form/create-custom-form.component';
import { SelectCustomFieldsComponent } from './select-custom-fields/select-custom-fields.component';

@NgModule({
	declarations: [CustomFieldsComponent, CustomFormsComponent, CreateCustomFormComponent, SelectCustomFieldsComponent],
	imports: [CommonModule, CustomFormsRoutingModule, ReactiveFormsModule, SharedModule, NgZorroModule, CustomFormsRoutingModule],
})
export class CustomFormsModule {}
