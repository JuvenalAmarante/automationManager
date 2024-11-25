const { exec } = require('child_process');
const LogAgendamento = require('../models/LogAgendamento');

class FilaController {
  filaExecucao = [];
  executando = false;

  adicionarNaFila(dados, agendamento_id) {
    this.filaExecucao.push({ dados, agendamento_id });
    console.log(`Automacao "${dados.nome}" adicionado à fila.`);

    if (!this.executando) {
      this.processarFila();
    }
  }

  async processarFila() {
    try {
      if (this.filaExecucao.length === 0) {
        console.log('Fila vazia, aguardando novas tarefas.');
        this.executando = false;
        return;
      }

      this.executando = true;
      const automacao = this.filaExecucao.shift();

      console.log(`Executando automação: ${automacao.dados.nome}`);
      let comando = `python3 ./src/public/${automacao.dados.arquivo} --id "${automacao.dados.id}"`;

      await LogAgendamento.create({
        possui_erro: false,
        agendamento_id: automacao.agendamento_id,
        retorno: 'Início da execução',
      });

      exec(comando, async (error, stdout, stderr) => {
        if (error) {
          await LogAgendamento.create({
            possui_erro: true,
            agendamento_id: automacao.agendamento_id,
            retorno: `Erro ao executar ${automacao.dados.nome}:\n\n${error.message}`,
          });

          console.error(
            `Erro ao executar ${automacao.dados.nome}:`,
            error.message
          );
        } else if (stderr) {
          await LogAgendamento.create({
            possui_erro: true,
            agendamento_id: automacao.agendamento_id,
            retorno: `Erro na automação ${automacao.dados.nome}:\n\n${stderr}`,
          });

          console.error(`Erro no automação ${automacao.dados.nome}:`, stderr);
        } else {
          await LogAgendamento.create({
            possui_erro: false,
            agendamento_id: automacao.agendamento_id,
            retorno: `Fim da execução\n\n${stdout}`,
          });

          console.log(`Saída de ${automacao.dados.nome}:`, stdout);
        }

        this.processarFila();
      });
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = new FilaController();
