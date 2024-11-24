import { Component, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
	selector: 'app-copy-link',
	templateUrl: './copy-link.component.html',
	styleUrl: './copy-link.component.less',
})
export class CopyLinkComponent {
	@Input() value: string | number | null | undefined;
	@Input() tootipText: string | null | undefined;

	constructor(private readonly messageService: NzMessageService) {}

	copy() {
		if (!this.value) return;
		navigator.clipboard.writeText(this.value.toString());
		this.messageService.success('Copiado com sucesso!');
	}
}
