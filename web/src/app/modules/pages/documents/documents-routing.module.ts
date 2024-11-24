import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentTypeComponent } from './document-type/document-type.component';
import { PermissaoEnum } from 'src/app/shared/enums/permissions';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'buscar',
  },
  {
    path: 'buscar',
    component: DocumentTypeComponent,
    data: { role: PermissaoEnum.ListarTiposDocumentos },
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentsRoutingModule {}
