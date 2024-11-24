import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
	selector: 'app-rocketchat',
	templateUrl: './rocketchat.component.html',
	styleUrls: ['./rocketchat.component.less'],
})
export class RocketchatComponent {
	urlRocket!: any;
	@ViewChild('ifChat', { static: true }) ifChat!: ElementRef<HTMLIFrameElement>;

	constructor(private sanitizer: DomSanitizer, private readonly apiService: ApiService, private readonly modalService: NzModalService) {
		this.getRocketAuth();
	}

	getRocketAuth() {
		this.apiService.get('/auth/rocketchat').subscribe({
			next: (res) => (this.urlRocket = this.sanitizer.bypassSecurityTrustResourceUrl(res.data.url)),
			error: (err) => {
				this.modalService.error({
					nzTitle: err.error.message,
					nzOnOk: () => window.close(),
				});
			},
		});
	}
}
