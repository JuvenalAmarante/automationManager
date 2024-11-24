import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';
import { debounce } from '../../helpers';
import { Condominio, DefaultResponse, Unidade } from '../../types';

@Component({
	selector: 'app-filtro-condominio',
	templateUrl: './filtro-condominio.component.html',
	styleUrls: ['./filtro-condominio.component.less'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: forwardRef(() => FiltroCondominioComponent),
		},
	],
})
export class FiltroCondominioComponent implements OnInit, ControlValueAccessor {
	@Input() selectModeCondominio: 'multiple' | 'default' = 'default';
	@Input() required: boolean = false;
	@Input() hasUnidade: boolean = true;
	@Input() searchAll: boolean = false;
	@Input() includeCompany: boolean = false;
	@Input() label: string = 'Condomínio';
	condominio: any;
	condominio_id: number = 0;
	unidade: string | string[] | undefined;
	condominios: Condominio[] = [];
	unidades: any[] = [];
	onTouched: any = () => {};
	onChange: any = () => {};
	values!: { condominio: number | number[]; unidade: number[] } | undefined;
	disabledUnidade = true;

	constructor(private api: ApiService) {}

	writeValue(values: { condominio: number | number[]; unidade: number[] } | undefined): void {
		this.values = values;
		this.getCondominios();
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	onInputBlur(event: any) {
		let unidades: any;
		if (Array.isArray(this.unidade)) {
			unidades = this.unidade ? this.unidade.map((item) => item.split('|').map((value) => +value)) : [];
		} else {
			unidades = this.unidade ? this.unidade.split('|').map((value) => +value) : [];
		}

		if (Array.isArray(this.condominio)) {
			this.disabledUnidade = !this.condominio.length || this.condominio.length > 1;
		} else {
			this.disabledUnidade = !this.condominio;
		}

		this.onChange({
			condominio: this.condominio,
			unidade: unidades,
		});
	}

	getCondominios(busca?: string) {
		this.unidades = [];
		this.api
			.post(this.searchAll === true ? '/condominiums/list' : '/condominiums/active', { condominio: busca || null, incluir_empresa: this.includeCompany })
			.subscribe({
				next: (res: DefaultResponse<Condominio[]>) => {
					this.condominios = res.data;

					if (this.values) {
						this.condominio = this.values.condominio;
						this.getUnidades(this.condominio);
					}
				},
			});
	}

	getUnidades(condominios_ids: number | number[], busca?: string) {
		if (!this.hasUnidade) return;

		if (!condominios_ids) {
			this.unidade = undefined;
			return;
		}
		if (Array.isArray(condominios_ids) && condominios_ids.length > 1) {
			this.unidade = undefined;
			return;
		}

		if (!this.condominio || (Array.isArray(this.condominio) && !this.condominio.length)) {
			this.unidade = undefined;
		}

		if (!this.condominio) {
			this.unidade = undefined;
		}

		if (!Array.isArray(condominios_ids) && this.condominio != this.condominio_id) {
			this.unidade = undefined;
			this.condominio_id = this.condominio;
		}

		if (Array.isArray(condominios_ids) && !condominios_ids.length) return;

		this.api
			.post(`/condominiums/residences/active`, {
				condominios_ids: Array.isArray(condominios_ids) ? condominios_ids : [condominios_ids],
				busca: busca || '',
			})
			.subscribe({
				next: (res: DefaultResponse<Unidade[]>) => {
					this.unidades = [];
					res.data.forEach((unid) => {
						unid.condominos.forEach((condomino) => {
							this.unidades.push({
								label: unid.codigo + ' - ' + condomino.condomino.nome + ' (' + condomino.tipo.descricao + ')',
								value: unid.id + '|' + condomino.condomino.id,
							});
						});
					});
					if (this.values) this.unidade = this.values ? this.values.unidade[0] + '|' + this.values.unidade[1] : '';
				},
			});
	}

	searchCondominios(busca: string) {
		debounce(() => {
			this.getCondominios(busca);
		});
	}

	searchUnidades(busca: string) {
		debounce(() => {
			if (this.condominio) {
				this.getUnidades(this.condominio, busca);
			}
		}, 500);
	}

	ngOnInit(): void {}
}
