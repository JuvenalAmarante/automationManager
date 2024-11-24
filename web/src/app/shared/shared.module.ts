import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxEditorModule } from 'ngx-editor';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { BarChartComponent } from './components/charts/bar-chart/bar-chart.component';
import { DonutChartComponent } from './components/charts/donut-chart/donut-chart.component';
import { EditorFormInputComponent } from './components/editor-form-input/editor-form-input.component';
import { EditorComponent } from './components/editor/editor.component';
import { FileViewerItemListComponent } from './components/file-viewer-item-list/file-viewer-item-list.component';
import { LayoutEditorComponent } from './components/layout-editor/layout-editor.component';
import { LayoutViewerComponent } from './components/layout-viewer/layout-viewer.component';
import { LinkButtonComponent } from './components/link-button/link-button.component';
import { ListResponsaveisComponent } from './components/list-responsaveis/list-responsaveis.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ModalConfirmationComponent } from './components/modal-confirmation/modal-confirmation.component';
import { ProtocolDocumentHistoryComponent } from './components/protocol-document-history/protocol-document-history.component';
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { NgZorroModule } from './ng-zorro.module';
import { SafeHTMLPipe } from './pipes/safeHTML.pipe';
import { CopyLinkComponent } from './components/copy-link/copy-link.component';
import { CreateCustomFieldsComponent } from '../modules/pages/custom-forms/create-custom-fields/create-custom-fields.component';

@NgModule({
	declarations: [
		EditorComponent,
		UploadFileComponent,
		ListResponsaveisComponent,
		LinkButtonComponent,
		LayoutEditorComponent,
		LoaderComponent,
		LayoutViewerComponent,
		SafeHTMLPipe,
		EditorFormInputComponent,
		FileViewerItemListComponent,
		ModalConfirmationComponent,
		ProtocolDocumentHistoryComponent,
		DonutChartComponent,
		BarChartComponent,
		CopyLinkComponent,
		CreateCustomFieldsComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgZorroModule,
		NgxMaskDirective,
		NgxMaskPipe,
		EditorModule,
		NgApexchartsModule,
		NgxEditorModule.forChild({
			locals: {
				bold: 'Negrito',
				italic: 'Itálico',
				code: 'Code',
				underline: 'Underline',
				strike: 'Sublinhado',
				blockquote: 'Blockquote',
				bullet_list: 'Lista',
				ordered_list: 'Lista Ordenada',
				heading: 'Cabeçalho',
				p: 'Parágrafo',
				h1: 'Cabeçalho 1',
				h2: 'Cabeçalho 2',
				h3: 'Cabeçalho 3',
				h4: 'Cabeçalho 4',
				h5: 'Cabeçalho 5',
				h6: 'Cabeçalho 6',
				align_left: 'Alinhar a Esquerda',
				align_center: 'Alinhar no Centro',
				align_right: 'Alinhar a Direita',
				align_justify: 'Justificar',
				text_color: 'Cor do Texto',
				background_color: 'Cor de Fundo',
				insertLink: 'Inserir Link',
				removeLink: 'Remover Link',
				insertImage: 'Inserir Imagem',

				url: 'URL',
				text: 'Texto',
				openInNewTab: 'Abrir em nova guia',
				insert: 'Inserir',
				altText: 'Texto Alternativo',
				title: 'Título',
				remove: 'Remover',
			},
		}),
	],
	exports: [
		EditorComponent,
		UploadFileComponent,
		ListResponsaveisComponent,
		NgxMaskDirective,
		NgxMaskPipe,
		LinkButtonComponent,
		LayoutEditorComponent,
		SafeHTMLPipe,
		EditorFormInputComponent,
		FileViewerItemListComponent,
		ProtocolDocumentHistoryComponent,
		DonutChartComponent,
		BarChartComponent,
		CopyLinkComponent,
	],
	providers: [provideNgxMask()],
})
export class SharedModule {}
