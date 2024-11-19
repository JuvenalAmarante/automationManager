const cron = require('node-cron');
const { exec } = require('child_process');

const Automacao = require('../models/Automacao');
const Agendamento = require('../models/Agendamento');
const FilaController = require('./FilaController');
const connection = require('../database');
const ParametroAutomacao = require('../models/ParametroAutomacao');
const ParametroAgendamento = require('../models/ParametroAgendamento');

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

      agendamentos.forEach((agendamento) => {
        const { id, horario, Automacao } = agendamento;

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

          FilaController.adicionarNaFila(automacao, parametrosFormatados);
        });

        this.tarefasAtivas[id] = tarefa;

        console.log(
          `Agendamento ${id} configurado para a automação ${Automacao.id}: ${Automacao.nome}`
        );
      });
    } catch (error) {
      console.error('Erro ao configurar agendamentos:', error.message);
    }
  };

  criar = async (req, res) => {
    const { automacao_id, horario, parametros } = req.body;

    if (!automacao_id || !horario || (parametros && !Array.isArray(parametros)))
      return res.status(400).json({ error: 'Campos inválidos' });

    const transaction = await connection.transaction();

    try {
      if (parametros) {
        let contador = 0;

        for await (const parametro of parametros) {
          if (!parametro.valor || !parametro.parametro_automacao_id) break;

          if (
            parametros.find(
              (item, index) =>
                item.parametro_automacao_id ==
                  parametro.parametro_automacao_id && index != contador
            )
          )
            break;

          const parametroAutomacao = await ParametroAutomacao.findByPk(
            parametro.parametro_automacao_id,
            {
              transaction,
            }
          );

          if (!parametroAutomacao) break;

          contador++;
        }

        if (contador != parametros.length)
          return res.status(400).json({ error: 'Parâmetros inválidos' });
      }

      const automacao = await Automacao.findByPk(automacao_id, {
        transaction,
      });

      if (!automacao)
        return res.status(400).json({ error: 'Automação não encontrada' });

      const listaParametros = await ParametroAutomacao.findAll({
        where: {
          automacao_id: automacao.id,
        },
      });

      if (
        listaParametros.length &&
        parametros?.length != listaParametros.length
      )
        return res
          .status(400)
          .json({ error: 'Os parâmetros são obrigatórios' });

      const agendamento = await Agendamento.create(
        {
          automacao_id,
          horario,
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
              valor: parametro.valor,
              agendamento_id: agendamento.id,
              parametro_automacao_id: parametro.parametro_automacao_id,
            },
            {
              transaction,
            }
          );

          parametrosSalvos.push(parametroSalvo);
        }
      }

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

        const parametrosFormatados = parametrosAgendamento.map((parametro) => ({
          nome: parametrosAutomacao.find(
            (item) =>
              item.dataValues.id === parametro.dataValues.parametro_automacao_id
          ).dataValues.nome,
          valor: parametro.valor,
        }));

        FilaController.adicionarNaFila(automacao, parametrosFormatados);
      });

      this.tarefasAtivas[agendamento.id] = tarefa;

      await transaction.commit();

      res
        .status(201)
        .json({ ...agendamento.dataValues, parametros: parametrosSalvos });
    } catch (error) {
      await transaction.rollback();

      res.status(500).json({ error: error.message });
    }
  };

  listar = async (req, res) => {
    try {
      const agendamentos = await Agendamento.findAll({
        include: [
          {
            model: Automacao,
          },
        ],
      });

      res.status(200).json(agendamentos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  async listarDetalhes(req, res) {
    const { id } = req.params;

    if (!id || isNaN(+id))
      return res.status(400).json({ error: 'Agendamento não encontrado' });

    try {
      const agendamento = await Agendamento.findByPk(id, {
        include: [
          {
            model: Automacao,
          },
        ],
      });

      if (!agendamento)
        return res.status(400).json({ error: 'Agendamento não encontrado' });

      const parametros = await ParametroAgendamento.findAll({
        where: {
          agendamento_id: id,
        },
      });

      res.status(200).json({ ...agendamento.dataValues, parametros });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  cancelar = async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(+id))
      return res.status(400).json({ error: 'Agendamento não encontrado' });

    try {
      const agendamento = await Agendamento.findByPk(id);

      if (!agendamento)
        return res.status(400).json({ error: 'Agendamento não encontrado' });

      await Agendamento.update({ ativo: false }, { where: { id } });

      if (this.tarefasAtivas[id]) {
        this.tarefasAtivas[id].stop();

        delete this.tarefasAtivas[id];

        console.log(`Agendamento ${id} cancelado.`);
      }

      res.status(200).json({ message: 'Agendamento cancelado.' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = new AgendamentoController();
