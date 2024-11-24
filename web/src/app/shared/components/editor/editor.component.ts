import { AfterViewInit, Component, Input, OnInit, inject } from '@angular/core';
import { Editor, Toolbar, toHTML, toDoc } from 'ngx-editor';
import { UntypedFormBuilder } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { DefaultResponse, LayoutsConsts } from '../../types';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.less'],
})
export class EditorComponent implements OnInit, AfterViewInit {
  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['horizontal_rule'],
  ];

  readonly #modal!: NzModalRef;
  readonly nzModalData!: {
    isModal: boolean;
    paramName: string;
    value?: string;
    required?: boolean;
  };

  @Input() useVars = false;
  @Input() paramName!: string;
  @Input() required: boolean = false;
  isModal: boolean = false;
  constLayout: LayoutsConsts[] = [];
  @Input() html: any;

  constructor(
    private fb: UntypedFormBuilder,
    private readonly api: ApiService
  ) {
    this.editor = new Editor();
    this.nzModalData = inject(NZ_MODAL_DATA);
    this.#modal = inject(NzModalRef);
    this.isModal = this.nzModalData.isModal;
    this.required = this.nzModalData.required || false;
    this.html = this.nzModalData.value ? toDoc(this.nzModalData.value) : null;
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.editor.commands.focus().exec();
    }, 500);
  }

  insertVariables(e: MouseEvent, key: string): void {
    e.preventDefault();
    this.editor.commands.insertText(key).focus().scrollIntoView().exec();
  }

  insertTable() {
    const table = '<box><table><tr><td> </td></tr></table></box>';
    this.editor.commands.insertHTML(table).focus().scrollIntoView().exec();
  }

  closeEditor() {
    this.#modal.close({ [this.nzModalData.paramName]: toHTML(this.html) });
  }

  closeModal() {
    this.#modal.close({
      [this.nzModalData.paramName]: this.nzModalData.value || '',
    });
  }

  getConsts() {
    this.api.get('/layouts-notification/consts').subscribe({
      next: (res: DefaultResponse<LayoutsConsts[]>) => {
        this.constLayout = res.data;
      },
    });
  }

  ngOnInit(): void {
    this.getConsts();
  }
}
