const { v4 } = require('uuid');
const { spawn } = require('child_process');
const LogAgendamento = require('../models/LogAgendamento');
const UsuarioTemAutomacao = require('../models/UsuarioTemAutomacao');
const path = require('path');
const LogErro = require('../models/LogErro');
const { Sequelize } = require('sequelize');

class FilaController {
  filaExecucao = [];
  executando = false;

  adicionarNaFila(dados, agendamento_id) {
    this.filaExecucao.push({
      id: v4(),
      dados,
      agendamento_id,
      adicionado_em: new Date(),
    });
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

      const nomePasta = path.join(
        __dirname,
        '..',
        'public',
        nomeAutomacao.shift()
      );

      console.log(`Executando automação: ${automacao.dados.nome}`);

      const pythonScript = `${nomePasta}/index.py`;
      const args = ['--id', automacao.dados.id];

      await LogAgendamento.create({
        possui_erro: false,
        agendamento_id: automacao.agendamento_id,
        retorno: 'Início da execução',
      });

      this.filaExecucao[0].executado_em = new Date();

      const processo = spawn('python', ['-u', pythonScript, ...args], {
        windowsHide: false,
        env: {
          ...process.env,
          PYTHONIOENCODING: 'utf8',
        },
      });

      let stdout = '';
      let stderr = '';

      processo.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      processo.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      processo.on('close', async (code) => {
        if (code == 1 && !stderr) {
          await LogAgendamento.create({
            possui_erro: true,
            agendamento_id: automacao.agendamento_id,
            retorno: `Automação ${automacao.dados.nome} foi encerrada:\n\n${stdout}`,
          });
        } else if (code !== 0 || stderr) {
          const erroMsg = stderr || `Erro com código de saída ${code}`;

          await LogAgendamento.create({
            possui_erro: true,
            agendamento_id: automacao.agendamento_id,
            retorno: `Erro na automação ${automacao.dados.nome}:\n\n${stdout}\n\n${erroMsg}`,
          });

          console.error(`Erro na automação ${automacao.dados.nome}:`, erroMsg);
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
      });

      processo.on('error', async (error) => {
        await LogAgendamento.create({
          possui_erro: true,
          agendamento_id: automacao.agendamento_id,
          retorno: `Erro ao executar ${automacao.dados.nome}:\n\n${stdout}\n\n${error.message}`,
        });

        console.error(
          `Erro ao executar ${automacao.dados.nome}:`,
          error.message
        );

        this.filaExecucao.shift();
        this.processarFila();
      });

      this.filaExecucao[0].processo = processo;
    } catch (error) {
      if (error instanceof Sequelize.ConnectionError)
        return res.status(500).json({
          success: false,
          message: 'Ocorreu ao se conectar com o banco de dados',
        });
      else
        await LogErro.create({
          modulo: 'Fila',
          funcao: 'processarFila',
          retorno: error.message,
        });
    }
  }

  encerrarProcesso = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    if (!id)
      return res
        .status(400)
        .json({ success: false, message: 'Item não encontrado' });

    try {
      const indexItemFila = this.filaExecucao.findIndex(
        (item) => item.id === id
      );

      if (indexItemFila == -1)
        return res
          .status(400)
          .json({ success: false, message: 'Item não encontrado' });

      if (this.filaExecucao[indexItemFila]) {
        let automacoes_ids = [];

        if (!usuario.admin) {
          const automacoesUsuario = await UsuarioTemAutomacao.findAll({
            where: {
              usuario_id: usuario.id,
            },
          });

          automacoes_ids = automacoesUsuario.map(
            (relacao) => relacao.dataValues.automacao_id
          );

          if (
            !automacoes_ids.includes(this.filaExecucao[indexItemFila].dados.id)
          )
            return res
              .status(400)
              .json({ success: false, message: 'Ação não permitida' });
        }

        if (this.filaExecucao[indexItemFila].processo) {
          // process.kill(this.filaExecucao[indexItemFila].processo.pid, 'SIGINT')
          const pid = this.filaExecucao[indexItemFila].processo.pid;

          spawn('taskkill', ['/PID', pid, '/T', '/F']);
        } else {
          this.filaExecucao.splice(indexItemFila, 1);
        }
      }

      res.status(200).json({
        success: true,
        message: 'Item removido da fila com sucesso',
      });
    } catch (error) {
      if (error instanceof Sequelize.ConnectionError)
        return res.status(500).json({
          success: false,
          message: 'Ocorreu ao se conectar com o banco de dados',
        });
      else
        await LogErro.create({
          modulo: 'Fila',
          funcao: 'processarFila',
          retorno: error.message,
        });
    }
  };

  listar = async (req, res) => {
    try {
      res.status(200).json({
        success: true,
        data: this.filaExecucao.map((item) => ({
          id: item.id,
          nome: item.dados.nome,
          agendamento_id: item.agendamento_id,
          adicionado_em: item.adicionado_em,
          executado_em: item.executado_em,
        })),
      });
    } catch (error) {
      if (error instanceof Sequelize.ConnectionError)
        return res.status(500).json({
          success: false,
          message: 'Ocorreu ao se conectar com o banco de dados',
        });
      else
        await LogErro.create({
          modulo: 'Fila',
          funcao: 'listar',
          retorno: error.message,
        });
    }
  };
}

module.exports = new FilaController();
