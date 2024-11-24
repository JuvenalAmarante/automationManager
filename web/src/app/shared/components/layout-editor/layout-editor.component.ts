import { Component, OnInit, Input, forwardRef, ViewEncapsulation } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { DefaultResponse, LayoutsConsts } from '../../types';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { EditorComponent } from '@tinymce/tinymce-angular';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => LayoutEditorComponent),
	multi: true,
};

@Component({
	selector: 'layout-editor',
	templateUrl: './layout-editor.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
	styleUrls: ['./layout-editor.component.less'],
})
export class LayoutEditorComponent implements OnInit, ControlValueAccessor {
	customToolbar = (editor: any) => {};
	constLayout!: LayoutsConsts[];
	@Input() html: string = '';
	onTouched: any = () => {};
	onChange: any = () => {};
	removed_items!: string | undefined;

	customInit = {};
	constructor(private readonly api: ApiService) {}

	onEditorChange() {
		this.onChange(this.html);
	}
	writeValue(value: any): void {
		this.html = value;
	}
	registerOnChange(fn: any): void {
		this.onChange = fn;
	}
	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	ngOnInit(): void {
		this.getConsts();
		this.setup();

		this.customInit = {
			height: '70vh',
			menubar: false,
			language: 'pt_BR',
			plugins: ['code', 'table', 'pagebreak', 'preview'],
			toolbar:
				'undo redo | fontfamily | formatselect | bold italic backcolor | \
				alignleft aligncenter alignright alignjustify | \
				pagebreak | \
				bullist numlist outdent indent | removeformat | \
				table tabledelete | tableprops tablerowprops tablecellprops | \
				tableinsertrowbefore tableinsertrowafter tabledeleterow | \
				tableinsertcolbefore tableinsertcolafter tabledeletecol tablerowheader | \
				variables',
			content_style: 'body{font-family: sans-serif;}',
			pagebreak_separator: '<div style="page-break-before: always;"></div>',
			pagebreak_split_block: true,
			font_family_formats: 'Arial=arial; Helvetica=helvetica; Sans-serif=sans-serif; Times New Roma= Times New Roma',
			setup: this.customToolbar,
			removed_menuitems: this.removed_items,
		};
	}

	setup() {
		this.customToolbar = (editor: any) => {
			return editor.ui.registry.addMenuButton('variables', {
				text: 'Variáveis',
				fetch: (callback: Function) => {
					const items = this.constLayout.map((item) => ({
						type: 'menuitem',
						text: item.label,
						onAction: () => editor.insertContent(item.const),
					}));
					callback(items);
				},
			});
		};
	}

	getConsts() {
		this.api.get('/layouts-notification/consts').subscribe({
			next: (res: DefaultResponse<LayoutsConsts[]>) => {
				this.constLayout = res.data;
				this.setup();
			},
		});
	}
}
