import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconDefinition } from '@ant-design/icons-angular';
import {
  QuestionOutline,
  LoginOutline,
  UserOutline,
  LockOutline,
  EyeInvisibleOutline,
} from '@ant-design/icons-angular/icons';
import { NgZorroModule } from 'src/app/shared/ng-zorro.module';

const icons: IconDefinition[] = [
  QuestionOutline,
  LoginOutline,
  UserOutline,
  LockOutline,
  EyeInvisibleOutline,
];
@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroModule,
  ],
  exports: [AuthComponent],
})
export class AuthModule {}
