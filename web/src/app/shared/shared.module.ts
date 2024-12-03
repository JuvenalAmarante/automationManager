import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { LoaderComponent } from './components/loader/loader.component';
import { NgZorroModule } from './ng-zorro.module';
import { SafeHTMLPipe } from './pipes/safeHTML.pipe';

@NgModule({
	declarations: [LoaderComponent, SafeHTMLPipe],
	imports: [CommonModule, FormsModule, ReactiveFormsModule, NgZorroModule, NgxMaskDirective, NgxMaskPipe, EditorModule],
	exports: [NgxMaskDirective, NgxMaskPipe, SafeHTMLPipe],
	providers: [provideNgxMask()],
})
export class SharedModule {}
