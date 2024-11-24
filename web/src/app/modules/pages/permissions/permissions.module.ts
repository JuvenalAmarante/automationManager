import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionsRoutingModule } from './permissions-routing.module';
import { PermissionsComponent } from './permissions.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NgZorroModule } from 'src/app/shared/ng-zorro.module';
import { PermissionsOcupationsComponent } from './permissions-ocupations/permissions-ocupations.component';
import { PermissionsUsersComponent } from './permissions-users/permissions-users.component';

@NgModule({
	declarations: [PermissionsComponent, PermissionsOcupationsComponent, PermissionsUsersComponent],
	imports: [CommonModule, PermissionsRoutingModule, FormsModule, ReactiveFormsModule, IconsProviderModule, NgZorroModule],
})
export class PermissionsModule {}
