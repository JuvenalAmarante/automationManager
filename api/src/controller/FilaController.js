const utf8 = require('utf8');
const { v4 } = require('uuid');
const { exec } = require('child_process');
const LogAgendamento = require('../models/LogAgendamento');

class FilaController {
  filaExecucao = [];
  executando = false;

  adicionarNaFila(dados, agendamento_id) {
    this.filaExecucao.push({ id: v4(), dados, agendamento_id });
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
      const automacao = this.filaExecucao[0];

      const nomeAutomacao = `${automacao.dados.arquivo}`.split('/');

      console.log(`Executando automação: ${automacao.dados.nome}`);
      let comando = `cd ./src/public/${nomeAutomacao.shift()} && python ${nomeAutomacao.join(
        '/'
      )} --id "${automacao.dados.id}"`;

      await LogAgendamento.create({
        possui_erro: false,
        agendamento_id: automacao.agendamento_id,
        retorno: 'Início da execução',
      });

      const abortSignal = new AbortController();

      exec(
        comando,
        { windowsHide: true, signal: abortSignal.signal },
        async (error, stdout, stderr) => {
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

          this.filaExecucao.shift();
          this.processarFila();
        }
      );

      this.filaExecucao[0].abortSignal = abortSignal;
    } catch (err) {
      console.error(err);
    }
  }

  encerrarProcesso = async (req, res) => {
    const { id } = req.params;

    if (!id)
      return res
        .status(400)
        .json({ success: false, message: 'Item não encontrado' });

    const indexItemFila = this.filaExecucao.findIndex((item) => item.id === id);

    if (indexItemFila == -1)
      return res
        .status(400)
        .json({ success: false, message: 'Item não encontrado' });

    if (this.filaExecucao[indexItemFila]) {
      if (this.filaExecucao[indexItemFila].abortSignal) {
        this.filaExecucao[indexItemFila].abortSignal.abort();
      } else {
        this.filaExecucao.splice(indexItemFila, 1);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Item removido da fila com sucesso',
    });
  };

  listar = (req, res) => {
    try {
      res.status(200).json({
        success: true,
        data: this.filaExecucao.map((item) => ({
          id: item.id,
          nome: item.dados.nome,
          agendamento_id: item.agendamento_id,
        })),
      });
    } catch (err) {
      console.error(err);
    }
  };
}

module.exports = new FilaController();
