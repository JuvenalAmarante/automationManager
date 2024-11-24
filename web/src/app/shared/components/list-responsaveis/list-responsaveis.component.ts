import { Component, Input, OnInit, inject } from '@angular/core';
import { ContatoUsuario, DefaultResponse, Usuario } from '../../types';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { ApiService } from 'src/app/core/services/api.service';
import { ContactType } from '../../constants/contact-types';

@Component({
	selector: 'app-list-responsaveis',
	templateUrl: './list-responsaveis.component.html',
	styleUrls: ['./list-responsaveis.component.less'],
})
export class ListResponsaveisComponent implements OnInit {
	responsaveis: Usuario[] = [];
	id: number = inject(NZ_MODAL_DATA);
	@Input() condominio_id!: number;

	constructor(private readonly api: ApiService) {}
	ngOnInit(): void {
		this.getResponsaveis(this.id || this.condominio_id);
	}

	getResponsaveis(id: number) {
		this.api.get(`/condominiums/${id}/responsibles`).subscribe({
			next: (res: DefaultResponse<Usuario[]>) => {
				this.responsaveis = res.data;
			},
		});
	}

	returnCelphoneContactType(contacts: ContatoUsuario[]) {
		return contacts.find(item => item.tipo == ContactType.TELEFONE);
	}

	returnWhatsappContactType(contacts: ContatoUsuario[]) {
		return contacts.find(item => item.tipo == ContactType.WHATSAPP);
	}

	returnRamalContactType(contacts: ContatoUsuario[]) {
		return contacts.find(item => item.tipo == ContactType.RAMAL);
	}
}
