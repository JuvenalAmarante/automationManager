import { ProtocolDocumentHistoryComponent } from 'src/app/shared/components/protocol-document-history/protocol-document-history.component';
import { HttpParams } from '@angular/common/http';
import {
	ApexAxisChartSeries,
	ApexChart,
	ApexDataLabels,
	ApexFill,
	ApexLegend,
	ApexNonAxisChartSeries,
	ApexPlotOptions,
	ApexResponsive,
	ApexStroke,
	ApexTooltip,
	ApexXAxis,
	ApexYAxis,
} from 'ng-apexcharts';

class BaseType {
	id?: number;
	created_at?: string | Date;
	updated_at?: string | Date;
}

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

export class Permission extends BaseType {
	override id!: number;
	key!: string;
	module!: string;
	label!: string;
	active!: boolean;
	cargos?: Array<{ cargo_id: number }>;
	usuarios?: Array<{ usuario: { uuid: string } }>;
}

export class Cargo extends BaseType {
	nome!: string;
	perfil?: 1 | 2;
	ativo?: boolean;
}

export class User extends BaseType {
	pessoa!: { nome: string };
	uuid!: string;
	ativo?: boolean;
}

export class Usuario extends BaseType {
	acessa_todos_departamentos!: boolean;
	email!: string;
	username!: string;
	password?: string;
	uuid!: string;
	pessoa!: {
		nome: string;
		contatos: {
			contato: string;
			tipo: number;
			observacao?: string;
		}[];
	};
	empresas!: {
		empresa_id: number;
		cargo?: Cargo;
		tipo_usuario: number;
	}[];
	departamentos!: {
		departamento_id: number;
		departamento: {
			id?: number;
			nome: string;
			filial: {
				id: number;
				nome: string;
			};
		};
	}[];
	ativo?: boolean;
}

export class ContatoUsuario {
	tipo!: number;
	contato!: string;
	observacao?: string;
}

export type MembroAdm = {
	membro: {
		nome: string;
		contatos: Array<{
			contato: string;
			tipo: number;
			observacao?: string;
		}>;
	};
	cargo: {
		nome: string;
		sindico: boolean;
	};
	inicio_mandato: Date | null;
	fim_mandato: Date | null;
};

export type Condominio = {
	id: number;
	nome: string;
	cnpj: string;
	numero: any;
	endereco: any;
	cep: any;
	bairro: any;
	cidade: any;
	uf: any;
	ativo: boolean;
	importado: boolean;
	categoria_id: number;
	contatos: Array<{
		contato: string;
		tipo: number;
		observacao?: string;
	}>;
	departamentos_condominio: Array<{
		departamento_id: number;
		departamento: {
			id?: number;
			nome: string;
			filial_id: number;
			filial: {
				nome: string;
			};
		};
	}>;
	membros_administracao: Array<MembroAdm>;
	condominios_tipos_contratos: {
		tipo_contrato: {
			id: number;
			nome: string;
			ativo: boolean;
		};
	}[];
	usuarios_condominio: Array<{
		usuario: {
			pessoa: {
				nome: string;
			};
			empresas: Array<{
				cargo: {
					nome: string;
				};
			}>;
		};
	}>;
	cargos: Array<{
		id: number;
		nome: string;
		usuarios: CondominioResponsavel[];
	}>;
	responsaveis: CondominioResponsavel[];
	tipos: Array<{
		integracao?: { descricao: string };
	}>;
};

export type CondominioResponsavel = {
	id: number;
	pessoa: { nome: string };
	empresas: EmpresaCargo[];
	departamentos: Array<{
		departamento: {
			id: number;
			nome: string;
			nac: boolean;
			ativo: boolean;
			filial: {
				id: number;
				nome: string;
			};
		};
	}>;
	telefone: string;
	whatsapp: string;
	email: string;
	ramal: any;
};

export type EmpresaCargo = {
	cargo: {
		id: number;
		nome: string;
	};
};

export type Unidade = {
	id: number;
	codigo: string;
	created_at: string;
	condominio?: {
		nome: string;
	};
	condominos: Array<{
		condomino: {
			nome: string;
			id: number;
			endereco: string;
			cidade: string;
			bairro: string;
		};
		tipo: {
			descricao: string;
		};
	}>;
	ativo: boolean;
};

export type NotificacaoSearch = {
	id: number;
	nome: string;
	expand: boolean;
	endereco: string;
	unidades_condominio: Array<{
		id: number;
		codigo: string;
		condominos: any[];
		notificacoes: Array<{
			id: number;
			data_emissao: string;
			data_infracao: string;
			pessoa_id: number;
			tipo_registro: number;
			tipo_infracao_id: number;
			valor_multa: number;
			observacoes: string;
			detalhes_infracao: string;
			tipo_infracao: {
				descricao: string;
			};
			pessoa: {
				nome: string;
				id: number;
				tipo: string;
			};
			unidade: {
				condominos: Array<{
					condomino: {
						nome: string;
					};
					tipo: {
						nome: string;
					};
				}>;
			};
			ativo: boolean;
		}>;
	}>;
};

export type Notificacao = {
	id: number;
	unidade_id: number;
	pessoa_id: number;
	tipo_infracao_id: number;
	tipo_registro: number;
	data_emissao: string;
	data_infracao: string;
	codigo: string;
	detalhes_infracao: string;
	fundamentacao_legal: string;
	observacoes: string;
	valor_multa: number;
	competencia_multa: string;
	unir_taxa: boolean;
	vencimento_multa: string;
	ativo: boolean;
	created_at: string;
	updated_at: string;
	unidade: {
		id: number;
		codigo: string;
		condominos: Array<{
			condomino: {
				id: number;
				nome: string;
			};
			tipo: {
				nome: string;
				descricao: string;
			};
		}>;
		condominio: {
			id: number;
			nome: string;
			cnpj: string;
			empresa_id: number;
			endereco: any;
			cep: any;
			bairro: any;
			cidade: any;
			uf: any;
			categoria_id: any;
			ativo: boolean;
			created_at: string;
			updated_at: string;
		};
	};
	tipo_infracao: {
		descricao: string;
	};
	prazo_recurso_vencido?: boolean;
	pessoa?: any;
	arquivos: Arquivo[];
};

export type Arquivo = {
	id: number;
	url: string;
	nome: string;
	origem: number;
	descricao?: string;
	tipo: string;
	referencia_id: number;
	ativo: boolean;
	created_at: Date;
	updated_at: Date;
	status?: string;
};

export type Tipo = {
	descricao: string;
};

export interface Ocupation {
	id: number;
	nome: string;
	ativo: boolean;
	created_at: string;
	updated_at: string;
}

export type ReportRequest = {
	condominios_ids?: number[] | number;
	unidades_ids?: number[] | unknown[];
	condominos_ids?: number[];
	tipo_notificacao?: number;
	tipo_registro?: number;
	consultores_ids?: number[] | number;
	consultor_id?: number;
	tipo_infracao_id?: number;
	tipo_data_filtro?: number;
	data_inicial?: string;
	data_final?: string;
};

export type NotificacaoCreateForm = {
	condominio: {
		condominio: number;
		unidade: Array<number>;
	};
	unidade_id: number;
	pessoa_id: number;
	data_emissao: string;
	data_infracao: string;
	tipo_registro: number;
	tipo_infracao_id: number;
	valor_multa: any;
	competencia_multa: any;
	unir_taxa: any;
	vencimento_multa: any;
	detalhes_infracao: string;
	fundamentacao_legal: string;
	observacoes: string;
};

export type Consultor = {
	uuid: string;
	pessoa: { nome: string };
	username: string;
	email: string;
	ativo: boolean;
	disabled: boolean;
	updated_at: string;
	acessa_todos_departamentos: boolean;
	empresas: Array<{
		empresa_id: number;
		cargo: {
			id: number;
			nome: string;
		};
	}>;
	departamentos: Array<{
		departamento_id: number;
		departamento: {
			nome: string;
		};
	}>;
	checked?: boolean;
};

export type RelatorioCondominio = {
	id: number;
	endereco: string;
	nome: string;
	unidades_condominio: RelatorioUnidadesCondominio[];
};

export type RelatorioNotificacaoFilial = {
	id: number;
	endereco: string;
	total: number;
	nome: string;
	condominios: RelatorioCondominio[];
};

export type RelatorioUnidadesCondominio = {
	codigo: string;
	condominos: Condomino[];
	notificacoes: RelatorioNotificacao[];
};

export type Condomino = {
	condomino: {
		id: number;
		nome: string;
		cnpj: string;
		empresa_id: any;
		numero: any;
		endereco: any;
		cep: any;
		bairro: any;
		cidade: any;
		uf: any;
		categoria_id: any;
		tipo_contrato_id: any;
		ativo: boolean;
		created_at: string;
		updated_at: string;
	};
	tipo: {
		id: number;
		nome: string;
		descricao: string;
		ativo: boolean;
		created_at: string;
		updated_at: string;
	};
};

export type RelatorioNotificacao = {
	id: number;
	unidade_id: number;
	pessoa_id: number;
	tipo_infracao_id: number;
	tipo_registro: number;
	data_emissao: string;
	pessoa: any;
	tipo_infracao: {
		id: number;
		descricao: string;
	};
	data_infracao: string;
	codigo: string;
	detalhes_infracao: string;
	fundamentacao_legal: string;
	observacoes: any;
	valor_multa: any;
	competencia_multa: any;
	unir_taxa: boolean;
	vencimento_multa: any;
	ativo: boolean;
	created_at: string;
	updated_at: string;
};

export type Pessoa = {
	id: number;
	nome: string;
	tipo: string;
};

export interface Count {
	notificacoes: number;
}

export class TipoInfracao extends BaseType {
	descricao!: string;
	fundamentacao_legal!: string;
	ativo!: boolean;
}

export type ApiParams =
	| {
			[key: string]: Object | Array<number | string | Object> | number | string | null | undefined;
	  }
	| FormData;
export class LayoutNotifications extends BaseType {
	nome!: string;
	modelo!: string;
	padrao!: boolean;
	ativo!: boolean;
}

export class LayoutsConsts {
	label!: string;
	const!: string;
}
export type GetParams =
	| HttpParams
	| {
			[param: string]: string | number | boolean | readonly (string | number | boolean)[];
	  }
	| undefined;

export class Departamentos extends BaseType {
	nome!: string;
	nac?: boolean;
	filial!: { id: number; nome: string };
}

export type SetupNotificacao = {
	primeira_reincidencia: boolean;
	primeira_reincidencia_base_pagamento: number;
	primeira_reincidencia_percentual_pagamento: number;
	segunda_reincidencia: boolean;
	segunda_reincidencia_base_pagamento: number;
	prazo_interpor_recurso: number;
	observacoes: string;
};

export type SetupMalotes = {
	rota_id: number;
	motoqueiro_id: number;
	quantidade_malotes: number;
	motoqueiro: { uuid: string };
};

export type UsuarioCondominiosVinculados = {
	condominios_ids: number[];
	condominios: Condominio[];
	condominiosCarteira: Condominio[];
};

export type Filial = {
	id: number;
	nome: string;
	ativo: boolean;
};

export type TipoContrato = {
	id: number;
	nome: string;
	ativo: boolean;
	created_at?: string;
	updated_at?: string;
};

export type SetupSystem = {
	salario_minimo_base: number;
	sancao: string;
	texto_padrao_notificacao: string;
};

export type SetupCompany = {
	id: number;
	nome: string;
	cnpj: string;
	numero: string;
	endereco: string;
	cep: string;
	bairro: string;
	cidade: string;
	uf: string;
};

export type SetupCompanyTheme = {
	logo?: string;
	logo_clara?: string;
};

export type TreeNode = {
	title: string;
	key: string;
	children?: TreeNode[];
	isLeaf?: boolean;
};

export type PermissionListMounted = {
	[key: string]: Array<{
		id: number;
		label: string;
		key: string;
		module: string;
		cargos: Array<{
			cargo_id: number;
		}>;
		usuarios?: Array<{
			usuario_id: number;
		}>;
	}>;
};

export type SettingsNotificationTabType = 'notificacao' | 'malotes';

export type SettingsSetupTabType = 'geral' | 'empresa';

export type Profile = {
	nome: string;
	admin: boolean;
};

export type Protocolo = {
	id: number;
	tipo: number;
	protocolo_malote: boolean;
	origem_usuario: {
		uuid: string;
		pessoa: { nome: string };
	};
	origem_departamento: {
		id: number;
		nome: string;
	};
	destino_usuario?: {
		uuid: string;
		pessoa: { nome: string };
	};
	destino_departamento: {
		id: number;
		nome: string;
		externo: boolean;
	};
	documentos: ProtocoloDocumento[];
	total_documentos?: {
		aceitos: number;
		rejeitados: number;
		total_recebidos: number;
	};
	retorna_malote_vazio: boolean;
	ativo: boolean;
	finalizado: boolean;
	situacao: number;
	motivo_cancelado?: string;
	data_finalizado: string;
	created_at: string;
	updated_at: string;
};

export type ProtocoloDocumento = {
	id: number;
	protocolo_id: number;
	tipo_documento?: {
		id: number;
		nome: string;
	};
	aceite_usuario?: {
		pessoa: { nome: string };
	};
	pessoa: {
		id: number;
		nome: string;
	};
	rejeitado: boolean;
	motivo_rejeitado: string;
	fila_geracao_malote: Array<{
		id: number;
		empresa_id: number;
		documento_id: number;
		gerado: boolean;
		excluido: boolean;
		created_at: string;
		updated_at: string;
	}>;
	malotes_documento: Array<{
		malote: { id: number; situacao: number };
	}>;
	origem_usuario: {
		uuid?: number;
		pessoa: { nome: string };
	};
	protocolo?: {
		origem_usuario: {
			pessoa: { nome: string };
		};
	};
	arquivos: Arquivo[];
	discriminacao: string;
	observacao: string;
	retorna: boolean;
	vencimento: string;
	valor: number;
	data_aceite: string;
	aceito: boolean;
	created_at: string;
	updated_at: string;
	checked?: boolean;
	total_anexos?: number;
	malote_virtual_id?: number;
};

export type ProtocoloDocumentos = {
	id: number;
	protocolo_id: number;
	tipo_documento_id: number;
	condominio_id: number;
	discriminacao: string;
	observacao: string;
	data_aceite: string;
	aceito: boolean;
	excluido: boolean;
	created_at: string;
	updated_at: string;
	total_anexos?: number;
};

export type DocumentTypes = {
	id: number;
	nome: string;
	ativo: boolean;
	created_at: string;
	updated_at: string;
};

export type ProtocoloCondominio = {
	id: number;
	nome: string;
	contatos: {
		id: number;
		contato: string;
		observcao: string | null;
		nome: string;
		cargo: string;
	}[];
};

export type NotificacaoEvent = {
	id: number;
	titulo: string;
	conteudo: string;
	dados?: any;
	rota?: string;
	lida: boolean;
	created_at?: string | Date;
	updated_at?: string | Date;
};

export type Integracao = {
	descricao: string;
	host: string;
	usuario: string;
	senha: string;
	porta: string;
	data_atualizacao: Date;
	token?: string;
};

export type MaloteFisico = {
	id: number;
	codigo: string;
	disponivel: boolean;
	situacao: number;
	empresa_id: number;
	ativo: boolean;
	alerta: boolean;
	excluido: boolean;
	create_at: string;
	update_at: string;
};

export type Rota = {
	id: number;
	turno: number;
	dom: boolean;
	seg: boolean;
	ter: boolean;
	qua: boolean;
	qui: boolean;
	sex: boolean;
	sab: boolean;
	ativo: boolean;
};

export type RotaSelecao = {
	id: number;
	nome: string;
};

export type MotoqueiroRota = {
	uuid: string;
	pessoa: {
		nome: string;
	};
};

export type FilaGeracaoPacotes = {
	condominio: {
		id: number;
		nome: string;
		checked: boolean;
		rotas: Array<any>;
		alerta_limite_malote: boolean;
		protocolos_documentos_condominio: Array<{
			id: number;
			protocolo_id: number;
			tipo_documento_id: number;
			condominio_id: number;
			aceite_usuario_id: number;
			discriminacao: string;
			observacao: any;
			data_aceite: string;
			aceito: boolean;
			excluido: boolean;
			created_at: string;
			updated_at: string;
			tipo_documento: {
				id: number;
				nome: string;
			};
			fila_geracao_malote: Array<{
				id: number;
			}>;
			aceite_usuario: {
				id: number;
				nome: string;
			};
		}>;
	};
};

export type MaloteFisicoSelecao = {
	id: number;
	codigo: string;
	alerta: boolean;
};

export type SetupMaloteFisico = {
	obriga_malote_fisico: boolean;
};

export type MaloteVirtual = {
	id: number;
	situacao: number;
	data_saida: string;
	protocolado_baixado: boolean;
	condominio: {
		nome: string;
		departamentos_condominio: {
			departamento: {
				id: number;
				nome: string;
			};
		}[];
		setup_rotas: {
			motoqueiro?: {
				pessoa: {
					nome: string;
				};
			};
		};
	};
	usuario: {
		pessoa: {
			nome: string;
		};
	};
	malote_fisico?: {
		codigo: string;
	};
	lacre_saida?: string;
	lacre_retorno?: string;
	documentos_malote: DocumentoMalote[];
	arquivos: Arquivo[];
	checked?: boolean;
};

export type DocumentoMalote = {
	id: number;
	situacao: number;
	justificativa: string;
	estornado: boolean;
	documento: {
		id: number;
		finalizado: boolean;
		retorna: boolean;
		tipo_documento: {
			id: number;
			nome: string;
		};
		discriminacao: string;
		observacao: string;
		vencimento: string;
	};
	checked: boolean;
};

export type RelatorioMaloteAnalitico = {
	id: number;
	data_saida: string;
	malote_fisico?: {
		codigo?: string;
	};
	condominio?: {
		id: number;
		nome: string;
	};
	documentos_malote: Array<{
		documento?: {
			id: number;
			discriminacao: string;
			retorna: boolean;
		};
	}>;
};

export type RelatorioMaloteSintetico = {
	data_saida: string;
	data_retorno: string;
	malote_fisico?: {
		codigo: string;
	};
	condominio?: {
		id: number;
		nome: string;
	};
	updated_at: string;
};

export type NewDocumentoMalote = {
	id: number;
	situacao?: number;
	estornado?: boolean;
	documento?: {
		id: number;
		finalizado: boolean;
		retorna: boolean;
		tipo_documento: {
			id: number;
			nome?: string;
		};
		discriminacao: string;
		observacao?: string;
		vencimento?: string;
	};
	checked: boolean;
};

export type MaloteFisicoDetalhes = {
	id: number;
	empresa_id: number;
	usuario_id: number;
	condominio_id: number;
	malote_fisico_id: number;
	situacao: number;
	excluido: boolean;
	data_saida: string;
	data_retorno: any;
	created_at: string;
	updated_at: string;
	malote_fisico: {
		id: number;
		empresa_id: number;
		codigo: string;
		disponivel: boolean;
		situacao: number;
		ativo: boolean;
		alerta: boolean;
		excluido: boolean;
		created_at: string;
		updated_at: string;
	};
	condominio?: {
		nome: string;
		endereco: string;
		numero: string;
		bairro: string;
		setup_rotas?: {
			motoqueiro: {
				pessoa: {
					nome: string;
					contatos: {
						contato: string;
						tipo: number;
						observacao?: string;
					}[];
				};
			};
		};
	};
	_count: {
		documentos_malote: number;
	};
};

export type Contato = {
	cargo: string;
	contato: string;
	id: number;
	nome: string;
	observacao: string | null;
	tipo: number;
};

export type ProtocoloDocumentoHistorico = {
	id: number;
	situacao: number;
	descricao?: string;
	created_at: string;
	usuario: {
		id: number;
		pessoa: {
			nome: string;
		};
	};
};

export type ProtocoloDocumentoHistoricoSituacao = {
	id: number;
	descricao: string;
	cor: 'blue' | 'red' | 'green' | 'gray';
	icone: string;
};

export class SystemParam extends BaseType {
	empresa_id!: number;
	label!: string;
	descricao?: string;
	chave!: string;
	valor!: boolean | string | number | null | undefined;
	tipo!: string;
	ativo?: boolean;
}

export type DonutChartOptions = {
	series: ApexAxisChartSeries | ApexNonAxisChartSeries;
	chart: ApexChart;
	dataLabels?: ApexDataLabels;
	plotOptions?: ApexPlotOptions;
	yaxis?: ApexYAxis;
	xaxis?: ApexXAxis;
	fill?: ApexFill;
	tooltip?: ApexTooltip;
	stroke?: ApexStroke;
	responsive: ApexResponsive[];
	labels?: any;
	legend: ApexLegend;
	colors: string[];
};

export type BarChartOptions = {
	series: ApexAxisChartSeries;
	chart: ApexChart;
	dataLabels: ApexDataLabels;
	plotOptions: ApexPlotOptions;
	xaxis: ApexXAxis;
	tooltip: ApexTooltip;
	labels?: any;
	colors: string[];
};

export type TicketCategoria = {
	id: number;
	empresa_id: number;
	nome: string;
	sla_id: number;
	sla_tempo: number;
	ativo: boolean;
	excluido: boolean;
	created_at: string;
	updated_at: string;
	_count: {
		subcategorias: number;
	};
};

export type TicketCategoriaOption = {
	id: number;
	nome: string;
};

export type TicketSubcategoria = {
	id: number;
	nome: string;
	ativo: boolean;
	sla_id: number;
	sla_tempo: number;
	created_at: string;
	updated_at: string;
	categoria: {
		nome: string;
		ativo: boolean;
	};
};

export type TicketSubcategoriaOption = {
	id: number;
	nome: string;
};

export type Tags = {
	id: number;
	texto: string;
	ativo: boolean;
};

export type TagOption = {
	id: number;
	texto: string;
};

export type TicketsStatus = {
	id: number;
	nome: string;
	pausa_sla: boolean;
	ativo: boolean;
	created_at: Date | string;
};

export type TicketsStatusOption = {
	id: number;
	nome: string;
};

export type TicketsSlas = {
	id: number;
	descricao: string;
	tempo: number;
	ativo: boolean;
};

export type CampoPersonalizado = {
	id: number;
	empresa_id: number;
	label: string;
	chave: string;
	elemento: string;
	mensagem_validacao: string;
	tipo_input: any;
	placeholder: string;
	checked?: boolean;
	mascara_input: any;
	caracteres_max: any;
	valor_padrao: string;
	tooltip: string;
	ativo: boolean;
	excluido: boolean;
	created_at: string;
	updated_at: string;
	campo_personalizado_opcoes: Array<{
		id: number;
		value: string;
		ativo: boolean;
	}>;
};

export type FormularioPersonalizado = {
	id: number;
	empresa_id: number;
	usuario_id: number;
	nome: string;
	ativo: boolean;
	excluido: boolean;
	created_at: string;
	updated_at: string;
	formulario_has_campos: Array<{
		campo_personalizado: {
			id: number;
			titulo: string;
			elemento: string;
			label: string;
			ativo: boolean;
		};
	}>;
};

export type Ticket = {
	id: number;
	assunto: string;
	descricao: string;
	em_pausa: false;
	finalizado: false;
	created_at: string;
	categoria: {
		id: number;
		nome: string;
	};
	subcategoria: {
		id: number;
		nome: string;
	};
	solicitante: {
		id: number;
		nome: string;
	};
	responsavel: {
		uuid: string;
		pessoa: {
			nome: string;
		};
	};
	seguidores: {
		uuid: string;
		pessoa: {
			nome: string;
		};
	}[];
	status: {
		id: number;
		nome: string;
	};
	tags: {
		tag: {
			id: number;
			texto: string;
		};
	}[];
};

export type Automacao = {
	id: number;
	nome: string;
	arquivo: string;
	criado_em: Date;
	atualizado_em: Date;
};
