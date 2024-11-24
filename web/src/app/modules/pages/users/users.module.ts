import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { NgZorroModule } from 'src/app/shared/ng-zorro.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersCreateComponent } from './users-create/users-create.component';
import { UsersDetailsComponent } from './users-details/users-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UsersCondominiumsComponent } from './users-condominiums/users-condominiums.component';

@NgModule({
  declarations: [
    UsersComponent,
    UsersCreateComponent,
    UsersDetailsComponent,
    UsersCondominiumsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroModule,
    UsersRoutingModule,
    SharedModule,
  ],
})
export class UsersModule {}
