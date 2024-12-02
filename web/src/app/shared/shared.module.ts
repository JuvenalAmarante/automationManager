import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxEditorModule } from 'ngx-editor';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { LoaderComponent } from './components/loader/loader.component';
import { NgZorroModule } from './ng-zorro.module';
import { SafeHTMLPipe } from './pipes/safeHTML.pipe';

@NgModule({
	declarations: [LoaderComponent, SafeHTMLPipe],
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
	exports: [NgxMaskDirective, NgxMaskPipe, SafeHTMLPipe],
	providers: [provideNgxMask()],
})
export class SharedModule {}
