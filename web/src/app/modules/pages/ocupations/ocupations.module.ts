import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OcupationsComponent } from './ocupations.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NgZorroModule } from 'src/app/shared/ng-zorro.module';
import { OcupationsRoutingModule } from './ocupations-routing.module';
import { OcupationsCreateComponent } from './ocupations-create/ocupations-create.component';

@NgModule({
  declarations: [OcupationsComponent, OcupationsCreateComponent],
  imports: [
    CommonModule,
    OcupationsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IconsProviderModule,
    NgZorroModule,
  ],
})
export class OcupationsModule {}
