import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentsRoutingModule } from './documents-routing.module';
import { DocumentTypeComponent } from './document-type/document-type.component';
import { NgZorroModule } from 'src/app/shared/ng-zorro.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DocumentTypeCreateComponent } from './document-type-create/document-type-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DocumentTypeComponent, DocumentTypeCreateComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroModule,
    DocumentsRoutingModule,
    SharedModule,
  ],
})
export class DocumentsModule {}
