import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { finalize } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { DefaultResponse, ProtocoloDocumentoHistorico, ProtocoloDocumentoHistoricoSituacao, User } from '../../types';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { debounce } from '../../helpers';

@Component({
	selector: 'app-protocol-document-history',
	templateUrl: './protocol-document-history.component.html',
	styleUrls: ['./protocol-document-history.component.css'],
})
export class ProtocolDocumentHistoryComponent implements OnInit {
	historyForm: FormGroup;
	situations: ProtocoloDocumentoHistoricoSituacao[] = [];
	users: User[] = [];
	histories: ProtocoloDocumentoHistorico[] = [];
	nzData: {
		isModal: boolean;
		protocolo_id: number;
	} = inject(NZ_MODAL_DATA);
	modalRef: NzModalRef = inject(NzModalRef);
	isLoading = false;
	isLoadingUsers = false;
	order: boolean = false;

	constructor(private readonly fb: UntypedFormBuilder, private readonly api: ApiService) {
		this.historyForm = this.fb.group({
			usuario_id: [null],
			data_registro: [null],
			situacao: [null],
		});
	}
	ngOnInit(): void {
		this.getHistory();
		this.getSituations();

		this.getUsers();
	}
	getHistory() {
		this.isLoading = true;
		this.histories = [];
		this.api
			.post(`/histories/protocol-documents/${this.nzData.protocolo_id}`, this.historyForm.value)
			.pipe(
				finalize(() => {
					this.isLoading = false;
				}),
			)
			.subscribe({
				next: (res: DefaultResponse<ProtocoloDocumentoHistorico[]>) => {
					this.histories = res.data;
				},
			});
	}

	sort() {
		this.order = !this.order;
		this.histories.sort((a, b) => {
			return this.order
				? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
				: new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
		});
	}

	getSituations() {
		this.api
			.get('/histories/protocol-documents/situations')
			.pipe(finalize(() => {}))
			.subscribe({
				next: (res: DefaultResponse<any[]>) => {
					this.situations = res.data;
				},
			});
	}

	getUsers(busca: string = '') {
		this.isLoadingUsers = true;
		debounce(() => {
			this.api.post('/users/active', {}).subscribe({
				next: (res: DefaultResponse<User[]>) => {
					this.users = res.data;
				},
			});
		}, 2);
	}

	mountSituationDescription(situation_id: number) {
		return this.situations.filter((situation) => situation.id === situation_id)[0]?.descricao;
	}

	mountSituationColor(situation_id: number): 'blue' | 'red' | 'green' | 'gray' {
		return this.situations.filter((situation) => situation.id === situation_id)[0]?.cor;
	}
	mountSituationIcon(situation_id: number) {
		return this.situations.filter((situation) => situation.id === situation_id)[0]?.icone;
	}
}
