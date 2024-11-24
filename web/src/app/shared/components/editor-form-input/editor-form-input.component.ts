import { Component, Input, forwardRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EditorComponent } from '../editor/editor.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-editor-form-input',
  templateUrl: './editor-form-input.component.html',
  styleUrls: ['./editor-form-input.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => EditorFormInputComponent),
    },
  ],
})
export class EditorFormInputComponent implements ControlValueAccessor {
  @Input() label!: string;
  @Input() required = false;
  @Input() placeholder!: string;
  @Input() message!: string;
  onTouched: any = () => { };
  onChange: any = () => { };
  value!: string | undefined;

  constructor(
    private readonly modalService: NzModalService,
    private readonly sanitize: DomSanitizer
  ) { }

  writeValue(value: any): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  sanitizeStyle(value: string) {
    return this.sanitize.bypassSecurityTrustHtml(value);
  }

  createModalEditor(paramName: string) {
    const modal = this.modalService.create({
      nzContent: EditorComponent,
      nzData: {
        isModal: true,
        paramName,
        value: this.value,
      },
      nzWidth: '80%',
      nzFooter: null,
    });

    modal.afterClose.subscribe({
      next: (value) => {
        if (!value) return;
        if (
          value &&
          value.input.match(/\<[^\/\>]*\>(\s*|&nbsp;)*\<\/[^\/\>]*\>/g)
        ) {
          value.input = null;
        }
        this.writeValue(value.input);
        this.onChange(value.input);
      },
    });
  }
}
