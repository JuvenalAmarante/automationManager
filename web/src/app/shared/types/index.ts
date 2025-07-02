import { HttpParams } from '@angular/common/http';

class BaseType {
	id?: number;
	created_at?: string | Date;
	updated_at?: string | Date;
}

export type GetParams =
	| HttpParams
	| {
			[param: string]: string | number | boolean | readonly (string | number | boolean)[];
	  }
	| undefined;

export type ApiParams =
	| {
			[key: string]: Object | Array<number | string | Object> | number | string | null | undefined;
	  }
	| FormData;

export class MenuItem extends BaseType {
	label!: string;
	url!: string;
	icon!: string;
	target!: string;
	items?: MenuItem[];
	item_id?: number;
	isActive?: boolean;
}

export type DefaultResponse<T> = {
	success: boolean;
	data: T;
	total?: number;
	message: string;
	total_pages?: number;
	total_multas?: number;
	total_infracoes?: number;
};

export type Profile = {
	nome: string;
	admin: boolean;
};

export type Automacao = {
	id: number;
	nome: string;
	arquivo: string;
	parametros?: {
		id: number;
		nome: string;
		tipo_parametro_id: number;
		qtd_digitos?: number;
		opcoes?: string[];
	}[];
	criado_em: Date;
	atualizado_em: Date;
};

export type TipoAgendamento = {
	id: number;
	nome: string;
	criado_em: Date;
	atualizado_em: Date;
};

export type TipoParametro = {
	id: number;
	nome: string;
	criado_em: Date;
	atualizado_em: Date;
};

export type Agendamento = {
	id: number;
	Automacao: Automacao;
	TipoAgendamento: TipoAgendamento;
	parametros?: Record<string, any>[];
	horario: string;
	proxima_execucao: Date;
	criado_em: Date;
	atualizado_em: Date;
};

export type Usuario = {
	id: number;
	nome: string;
	usuario: string;
	admin: boolean;
	ativo: boolean;
};

export type FilaItem = {
	id: number;
	nome: string;
	agendamento_id: number;
	adicionado_em: Date;
	executado_em?: Date;
};

export type LogAgendamento = {
	id: number;
	agendamento_id: number;
	possui_erro: boolean;
	retorno: string;
	criado_em: Date | string;
};
