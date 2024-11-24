import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomFormsComponent } from './custom-forms.component';
import { PermissaoEnum } from 'src/app/shared/enums/permissions';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { CustomFieldsComponent } from './custom-fields/custom-fields.component';
import { CreateCustomFormComponent } from './create-custom-form/create-custom-form.component';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'buscar',
	},
	{
		path: 'buscar',
		component: CustomFormsComponent,
		canActivate: [AuthGuard],
		data: { role: PermissaoEnum.CadastrarFormularioPersonalizado },
	},
	{
		path: 'cadastrar',
		component: CreateCustomFormComponent,
		canActivate: [AuthGuard],
		data: { role: PermissaoEnum.CadastrarFormularioPersonalizado },
	},
	{
		path: 'editar/:id',
		component: CreateCustomFormComponent,
		canActivate: [AuthGuard],
		data: { role: PermissaoEnum.AtualizarFormulariosPersonalizadosPorID },
	},

	{
		path: 'campos-personalizados',
		component: CustomFieldsComponent,
		canActivate: [AuthGuard],
		data: { role: PermissaoEnum.CadastrarCampoPersonalizado },
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class CustomFormsRoutingModule {}
