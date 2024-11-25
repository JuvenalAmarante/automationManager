const cron = require('node-cron');
var parser = require('cron-parser');

const Automacao = require('../models/Automacao');
const Agendamento = require('../models/Agendamento');
const FilaController = require('./FilaController');
const connection = require('../database');
const ParametroAutomacao = require('../models/ParametroAutomacao');
const ParametroAgendamento = require('../models/ParametroAgendamento');
const LogAgendamento = require('../models/LogAgendamento');
const TipoAgendamento = require('../models/TipoAgendamento');

class AgendamentoController {
  tarefasAtivas = {};

  constructor() {
    this.configurar();
  }

  configurar = async () => {
    try {
      const agendamentos = await Agendamento.findAll({
        where: { ativo: true },
        include: [
          {
            model: Automacao,
          },
        ],
      });

      for await (const agendamento of agendamentos) {
        const { id, horario, tipo_agendamento_id, Automacao } = agendamento;

        const tarefa = cron.schedule(horario, async () => {
          const parametrosAgendamento = await ParametroAgendamento.findAll({
            where: {
              agendamento_id: agendamento.id,
            },
          });

          const parametrosAutomacao = await ParametroAutomacao.findAll({
            where: {
              automacao_id: agendamento.automacao_id,
            },
          });

          const parametrosFormatados = parametrosAgendamento.map(
            (parametro) => ({
              nome: parametrosAutomacao.find(
                (item) =>
                  item.dataValues.id ===
                  parametro.dataValues.parametro_automacao_id
              ).dataValues.nome,
              valor: parametro.valor,
            })
          );

          FilaController.adicionarNaFila(
            Automacao,
            agendamento.id,
            parametrosFormatados
          );

          if (tipo_agendamento_id == 1) {
            await Agendamento.update(
              { ativo: false },
              {
                where: {
                  id: agendamento.id,
                },
              }
            );

            this.tarefasAtivas[id].stop();

            delete this.tarefasAtivas[id];
          }
        });

        this.tarefasAtivas[id] = tarefa;

        console.log(
          `Agendamento ${id} configurado para a automação ${Automacao.id}: ${Automacao.nome}`
        );
      }
    } catch (error) {
      console.error('Erro ao configurar agendamentos:', error.message);
    }
  };

  criar = async (req, res) => {
    const { automacao_id, horario, tipo_id, parametros } = req.body;

    if (
      !automacao_id ||
      !horario ||
      !tipo_id ||
      (parametros && !Array.isArray(parametros))
    )
      return res
        .status(400)
        .json({ success: false, message: 'Campos inválidos' });

    const transaction = await connection.transaction();

    try {
      const automacao = await Automacao.findByPk(automacao_id, {
        transaction,
      });

      if (!automacao)
        return res
          .status(400)
          .json({ success: false, message: 'Automação não encontrada' });

      const listaParametros = await ParametroAutomacao.findAll({
        where: {
          automacao_id: automacao.id,
        },
        transaction,
      });

      if (listaParametros.length && !parametros?.length)
        return res.status(400).json({
          success: false,
          message: 'Os parâmetros são obrigatórios',
        });

      if (parametros) {
        let contador = 0;

        for await (const parametro of parametros) {
          let validacao = true;

          for await (const parametroSalvo of listaParametros) {
            if (parametro[parametroSalvo.dataValues.nome] == null) {
              validacao = false;
              break;
            }

            if (parametroSalvo.dataValues.id == 2) {
              parametro[parametroSalvo.dataValues.nome] = (
                '0'.repeat(parametroSalvo.dataValues.qtd_digitos) +
                parametro[parametroSalvo.dataValues.nome]
              ).slice(-parametroSalvo.dataValues.qtd_digitos);
            }

            if ([3, 4, 5].includes(parametroSalvo.dataValues.id)) {
              const date = new Date(parametro[parametroSalvo.dataValues.nome]);

              const dia = date.getDate();
              const mes = date.getMonth() + 1;
              const ano = date.getFullYear();

              switch (parametroSalvo.dataValues.id) {
                case 3:
                  parametro[
                    parametroSalvo.dataValues.nome
                  ] = `${dia}/${mes}/${ano}`;
                  break;

                case 4:
                  parametro[parametroSalvo.dataValues.nome] = `${dia}/${mes}`;
                  break;

                case 5:
                  parametro[parametroSalvo.dataValues.nome] = `${mes}/${ano}`;
                  break;
              }
            }
          }

          if (!validacao) break;

          contador++;
        }

        if (contador != parametros.length)
          return res
            .status(400)
            .json({ success: false, message: 'Parâmetros inválidos' });
      }

      let horarioFormatado = ``;

      const date = new Date(horario);

      const minutes = date.getMinutes();
      const hours = date.getHours();
      const days = date.getDate();
      const months = date.getMonth() + 1;
      const dayOfWeek = date.getDay();

      switch (tipo_id) {
        case 1:
          horarioFormatado = `${minutes} ${hours} ${days} ${months} *`;
          break;
        case 2:
          horarioFormatado = `${minutes} ${hours} * * *`;
          break;
        case 3:
          horarioFormatado = `${minutes} ${hours} * * ${dayOfWeek}`;
          break;
        case 4:
          horarioFormatado = `${minutes} ${hours} ${days} * *`;
          break;
      }

      const agendamento = await Agendamento.create(
        {
          automacao_id,
          tipo_agendamento_id: tipo_id,
          horario: horarioFormatado,
          ativo: true,
        },
        {
          transaction,
        }
      );

      let parametrosSalvos = [];

      if (parametros) {
        for await (const parametro of parametros) {
          const parametroSalvo = await ParametroAgendamento.create(
            {
              valor: JSON.stringify(parametro),
              agendamento_id: agendamento.dataValues.id,
            },
            {
              transaction,
            }
          );

          parametrosSalvos.push(parametroSalvo);
        }
      }

      const tarefa = cron.schedule(horarioFormatado, async () => {
        const parametrosAgendamento = await ParametroAgendamento.findAll({
          where: {
            agendamento_id: agendamento.id,
          },
        });

        const parametrosAutomacao = await ParametroAutomacao.findAll({
          where: {
            automacao_id: agendamento.automacao_id,
          },
        });

        const parametrosFormatados = parametrosAgendamento.map((parametro) => ({
          nome: parametrosAutomacao.find(
            (item) =>
              item.dataValues.id === parametro.dataValues.parametro_automacao_id
          ).dataValues.nome,
          valor: parametro.valor,
        }));

        FilaController.adicionarNaFila(
          automacao,
          agendamento.dataValues.id,
          parametrosFormatados
        );

        if (tipo_id == 1) {
          await Agendamento.update(
            { ativo: false },
            {
              where: {
                id: agendamento.id,
              },
            }
          );

          this.tarefasAtivas[id].stop();

          delete this.tarefasAtivas[id];
        }
      });

      this.tarefasAtivas[agendamento.id] = tarefa;

      await transaction.commit();

      res.status(201).json({
        success: true,
        data: { ...agendamento.dataValues, parametros: parametrosSalvos },
      });
    } catch (error) {
      await transaction.rollback();

      res.status(500).json({ success: false, message: error.message });
    }
  };

  listar = async (req, res) => {
    try {
      const agendamentos = await Agendamento.findAll({
        include: [
          {
            model: Automacao,
          },
          {
            model: TipoAgendamento,
          },
        ],
      });

      res.status(200).json({
        success: true,
        data: agendamentos.map((agendamento) => ({
          ...agendamento.dataValues,
          proxima_execucao: parser
            .parseExpression(agendamento.dataValues.horario)
            .next(),
        })),
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  async listarDetalhes(req, res) {
    const { id } = req.params;

    if (!id || isNaN(+id))
      return res
        .status(400)
        .json({ success: false, message: 'Agendamento não encontrado' });

    try {
      const agendamento = await Agendamento.findByPk(id, {
        include: [
          {
            model: Automacao,
          },
          {
            model: TipoAgendamento,
          },
        ],
      });

      if (!agendamento)
        return res
          .status(400)
          .json({ success: false, message: 'Agendamento não encontrado' });

      const listaParametros = await ParametroAutomacao.findAll({
        where: {
          automacao_id: agendamento.Automacao.id,
        },
      });

      const parametrosSalvos = await ParametroAgendamento.findAll({
        where: {
          agendamento_id: id,
        },
      });

      const parametros = parametrosSalvos.map((parametro) => {
        const dados = JSON.parse(parametro.dataValues.valor);

        for (const parametroCadastrado of listaParametros) {
          if (parametroCadastrado.dataValues.id == 2) {
            dados[parametroCadastrado.dataValues.nome] = parseInt(
              dados[parametroCadastrado.dataValues.nome]
            );
          }

          if ([3, 4, 5].includes(parametroCadastrado.dataValues.id)) {
            const date = dados[parametroCadastrado.dataValues.nome].split('/');

            switch (parametroCadastrado.dataValues.id) {
              case 3:
                dados[parametroCadastrado.dataValues.nome] = new Date(
                  date[2],
                  date[1] - 1,
                  date[0]
                );
                break;

              case 4:
                dados[parametroCadastrado.dataValues.nome] = new Date(
                  new Date().getFullYear(),
                  date[1] - 1,
                  date[0]
                );
                break;

              case 5:
                dados[parametroCadastrado.dataValues.nome] = new Date(
                  date[1],
                  date[0] - 1,
                  15
                );
                break;
            }
          }
        }

        return dados;
      });

      res.status(200).json({
        success: true,
        data: {
          ...agendamento.dataValues,
          proxima_execucao: parser
            .parseExpression(agendamento.dataValues.horario)
            .next(),
          parametros,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async listarLogs(req, res) {
    const { id } = req.params;

    if (!id || isNaN(+id))
      return res
        .status(400)
        .json({ success: false, message: 'Agendamento não encontrado' });

    try {
      const agendamento = await Agendamento.findByPk(id, {
        include: [
          {
            model: Automacao,
          },
        ],
      });

      if (!agendamento)
        return res
          .status(400)
          .json({ success: false, message: 'Agendamento não encontrado' });

      const logs = await LogAgendamento.findAll({
        where: {
          agendamento_id: id,
        },
      });

      res.status(200).json({ success: true, data: logs });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  atualizar = async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(+id))
      return res
        .status(400)
        .json({ success: false, message: 'Agendamento não encontrado' });

    const { automacao_id, horario, tipo_id, parametros } = req.body;

    if (
      !automacao_id ||
      !horario ||
      !tipo_id ||
      (parametros && !Array.isArray(parametros))
    )
      return res
        .status(400)
        .json({ success: false, message: 'Campos inválidos' });

    const transaction = await connection.transaction();

    try {
      let agendamento = await Agendamento.findByPk(id, {
        include: [
          {
            model: Automacao,
          },
        ],
        transaction,
      });

      if (!agendamento)
        return res
          .status(400)
          .json({ success: false, message: 'Agendamento não encontrado' });

      const automacao = await Automacao.findByPk(automacao_id, {
        transaction,
      });

      if (!automacao)
        return res
          .status(400)
          .json({ success: false, message: 'Automação não encontrada' });

      const listaParametros = await ParametroAutomacao.findAll({
        where: {
          automacao_id: automacao.id,
        },
        transaction,
      });

      if (listaParametros.length && !parametros?.length)
        return res.status(400).json({
          success: false,
          message: 'Os parâmetros são obrigatórios',
        });

      if (parametros) {
        let contador = 0;

        for await (const parametro of parametros) {
          let validacao = true;

          for await (const parametroSalvo of listaParametros) {
            if (parametro[parametroSalvo.dataValues.nome] == null) {
              validacao = false;
              break;
            }

            if (parametroSalvo.dataValues.id == 2) {
              parametro[parametroSalvo.dataValues.nome] = (
                '0'.repeat(parametroSalvo.dataValues.qtd_digitos) +
                parametro[parametroSalvo.dataValues.nome]
              ).slice(-parametroSalvo.dataValues.qtd_digitos);
            }

            if ([3, 4, 5].includes(parametroSalvo.dataValues.id)) {
              const date = new Date(parametro[parametroSalvo.dataValues.nome]);

              const dia = date.getDate();
              const mes = date.getMonth() + 1;
              const ano = date.getFullYear();

              switch (parametroSalvo.dataValues.id) {
                case 3:
                  parametro[
                    parametroSalvo.dataValues.nome
                  ] = `${dia}/${mes}/${ano}`;
                  break;

                case 4:
                  parametro[parametroSalvo.dataValues.nome] = `${dia}/${mes}`;
                  break;

                case 5:
                  parametro[parametroSalvo.dataValues.nome] = `${mes}/${ano}`;
                  break;
              }
            }
          }

          if (!validacao) break;

          contador++;
        }

        if (contador != parametros.length)
          return res
            .status(400)
            .json({ success: false, message: 'Parâmetros inválidos' });
      }

      let horarioFormatado = ``;

      const date = new Date(horario);

      const minutes = date.getMinutes();
      const hours = date.getHours();
      const days = date.getDate();
      const months = date.getMonth() + 1;
      const dayOfWeek = date.getDay();

      switch (tipo_id) {
        case 1:
          horarioFormatado = `${minutes} ${hours} ${days} ${months} *`;
          break;
        case 2:
          horarioFormatado = `${minutes} ${hours} * * *`;
          break;
        case 3:
          horarioFormatado = `${minutes} ${hours} * * ${dayOfWeek}`;
          break;
        case 4:
          horarioFormatado = `${minutes} ${hours} ${days} * *`;
          break;
      }

      await Agendamento.update(
        {
          automacao_id,
          tipo_agendamento_id: tipo_id,
          horario: horarioFormatado,
          ativo: true,
        },
        {
          where: {
            id,
          },
          transaction,
        }
      );

      await ParametroAgendamento.destroy({
        where: {
          agendamento_id: id,
        },
        transaction,
      });

      let parametrosSalvos = [];

      if (parametros) {
        for await (const parametro of parametros) {
          const parametroSalvo = await ParametroAgendamento.create(
            {
              valor: JSON.stringify(parametro),
              agendamento_id: agendamento.dataValues.id,
            },
            {
              transaction,
            }
          );

          parametrosSalvos.push(parametroSalvo);
        }
      }

      const tarefa = cron.schedule(horarioFormatado, async () => {
        const parametrosAgendamento = await ParametroAgendamento.findAll({
          where: {
            agendamento_id: agendamento.id,
          },
        });

        const parametrosAutomacao = await ParametroAutomacao.findAll({
          where: {
            automacao_id: agendamento.automacao_id,
          },
        });

        const parametrosFormatados = parametrosAgendamento.map((parametro) => ({
          nome: parametrosAutomacao.find(
            (item) =>
              item.dataValues.id === parametro.dataValues.parametro_automacao_id
          ).dataValues.nome,
          valor: parametro.valor,
        }));

        FilaController.adicionarNaFila(
          automacao,
          agendamento.dataValues.id,
          parametrosFormatados
        );

        if (tipo_id == 1) {
          await Agendamento.update(
            { ativo: false },
            {
              where: {
                id: agendamento.id,
              },
            }
          );

          this.tarefasAtivas[id].stop();

          delete this.tarefasAtivas[id];
        }
      });

      this.tarefasAtivas[agendamento.id] = tarefa;

      await transaction.commit();

      res.status(201).json({
        success: true,
        message: 'Agendamento atualizado com sucesso!',
      });
    } catch (error) {
      await transaction.rollback();

      res.status(500).json({ success: false, message: error.message });
    }
  };

  cancelar = async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(+id))
      return res
        .status(400)
        .json({ success: false, message: 'Agendamento não encontrado' });

    try {
      const agendamento = await Agendamento.findByPk(id);

      if (!agendamento)
        return res
          .status(400)
          .json({ success: false, message: 'Agendamento não encontrado' });

      await Agendamento.update({ ativo: false }, { where: { id } });

      if (this.tarefasAtivas[id]) {
        this.tarefasAtivas[id].stop();

        delete this.tarefasAtivas[id];

        console.log(`Agendamento ${id} cancelado.`);
      }

      res.status(200).json({ message: 'Agendamento cancelado.' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

module.exports = new AgendamentoController();
