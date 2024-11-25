import { Component, OnInit, inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/core/services/api.service';
import { ContactType } from 'src/app/shared/constants/contact-types';
import { DefaultResponse, User, Usuario } from 'src/app/shared/types';

type data = { isModal?: boolean; userId?: number };

@Component({
	selector: 'app-users-details',
	templateUrl: './users-details.component.html',
	styleUrls: ['./users-details.component.less'],
})
export class UsersDetailsComponent implements OnInit {
	constructor(private readonly api: ApiService, private readonly messageService: NzMessageService) {}

	details?: Usuario;
	nzData: data = inject(NZ_MODAL_DATA);

	ngOnInit() {
		if (this.nzData?.userId) {
			this.getUser(this.nzData?.userId);
		}
	}

	getUser(id: number) {
		this.api.get(`/usuarios/${id}`).subscribe({
			next: (res: DefaultResponse<Usuario>) => {
				this.details = res.data;
			},
		});
	}
}
