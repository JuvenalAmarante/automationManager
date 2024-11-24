export class VirtualPackageStatus {
	static PENDENTE = 1;
	static RETORNADO = 2;
	static PROTOCOLADO = 3;
	static BAIXADO = 4;
	static ENVIADO = 5;

	static SITUACOES: { [key: number]: string } = {
		1: 'Pendente',
		2: 'Retornado',
		3: 'Protocolado',
		4: 'Baixado',
		5: 'Enviado',
	};
}
