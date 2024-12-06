const cron = require('node-cron');
var parser = require('cron-parser');

const Automacao = require('../models/Automacao');
const Agendamento = require('../models/Agendamento');
const FilaController = require('./FilaController');
const connection = require('../database');
const ParametroAutomacao = require('../models/ParametroAutomacao');
const Parametro = require('../models/Parametro');
const LogAgendamento = require('../models/LogAgendamento');
const TipoAgendamento = require('../models/TipoAgendamento');
const UsuarioTemAutomacao = require('../models/UsuarioTemAutomacao');
const { Op } = require('sequelize');

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
          FilaController.adicionarNaFila(Automacao, agendamento.id);

          if (tipo_agendamento_id == 1) {
            await Agendamento.update(
              { ativo: false },
              {
                where: {
                  id: agendamento.id,
                },
              }
            );

            this.tarefasAtivas[id]?.stop();

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
    const { usuario } = req;
    const { automacao_id, horario, tipo_id } = req.body;

    if (!automacao_id || !horario || !tipo_id)
      return res
        .status(400)
        .json({ success: false, message: 'Campos inválidos' });

    const transaction = await connection.transaction();

    try {
      let automacoes_ids = [];
      if (!usuario.admin) {
        automacoes_ids = (
          await UsuarioTemAutomacao.findAll({
            where: {
              usuario_id: usuario.id,
            },
          })
        ).map((relacao) => relacao.dataValues.automacao_id);
      }

      let where = {
        id: automacao_id,
      };

      if (!usuario.admin)
        where.id = {
          [Op.in]: automacoes_ids,
        };

      const automacao = await Automacao.findOne({
        where,
        transaction,
      });

      if (!automacao)
        return res
          .status(400)
          .json({ success: false, message: 'Automação não encontrada' });

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

      const tarefa = cron.schedule(horarioFormatado, async () => {
        FilaController.adicionarNaFila(automacao, agendamento.dataValues.id);

        if (tipo_id == 1) {
          await Agendamento.update(
            { ativo: false },
            {
              where: {
                id: agendamento.id,
              },
            }
          );

          this.tarefasAtivas[id]?.stop();

          delete this.tarefasAtivas[id];
        }
      });

      this.tarefasAtivas[agendamento.id] = tarefa;

      await transaction.commit();

      res.status(201).json({
        success: true,
        message: 'Agendamento salvo com sucesso!',
      });
    } catch (error) {
      await transaction.rollback();

      res
        .status(500)
        .json({ success: false, message: 'Ocorreu um erro interno' });
    }
  };

  listar = async (req, res) => {
    const { usuario } = req;
    try {
      let automacoes_ids = [];
      if (!usuario.admin) {
        automacoes_ids = (
          await UsuarioTemAutomacao.findAll({
            where: {
              usuario_id: usuario.id,
            },
          })
        ).map((relacao) => relacao.dataValues.automacao_id);
      }

      let where = {
        excluido: false,
      };

      if (!usuario.admin)
        where.automacao_id = {
          [Op.in]: automacoes_ids,
        };

      const agendamentos = await Agendamento.findAll({
        where,
        order: [['id', 'DESC']],
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
          proxima_execucao:
            agendamento.dataValues.ativo
              ? parser.parseExpression(agendamento.dataValues.horario).next()
              : null,
        })),
      });
    } catch (error) {
      console.log(error);

      res
        .status(500)
        .json({ success: false, message: 'Ocorreu um erro interno' });
    }
  };

  async listarDetalhes(req, res) {
    const { id } = req.params;

    if (!id || isNaN(+id))
      return res
        .status(400)
        .json({ success: false, message: 'Agendamento não encontrado' });

    try {
      const agendamento = await Agendamento.findOne({
        where: {
          id,
          excluido: false,
        },
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

      res.status(200).json({
        success: true,
        data: {
          ...agendamento.dataValues,
          proxima_execucao: parser
            .parseExpression(agendamento.dataValues.horario)
            .next(),
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Ocorreu um erro interno' });
    }
  }

  async listarLogs(req, res) {
    const { id } = req.params;

    if (!id || isNaN(+id))
      return res
        .status(400)
        .json({ success: false, message: 'Agendamento não encontrado' });

    try {
      const agendamento = await Agendamento.findOne({
        where: {
          id,
          excluido: false,
        },
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
        order: [['id', 'DESC']],
      });

      res.status(200).json({ success: true, data: logs });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Ocorreu um erro interno' });
    }
  }

  atualizar = async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(+id))
      return res
        .status(400)
        .json({ success: false, message: 'Agendamento não encontrado' });

    const { automacao_id, horario, tipo_id } = req.body;

    if (!automacao_id || !horario || !tipo_id)
      return res
        .status(400)
        .json({ success: false, message: 'Campos inválidos' });

    const transaction = await connection.transaction();

    try {
      let agendamento = await Agendamento.findOne({
        where: {
          id,
          excluido: false,
        },
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

      this.tarefasAtivas[agendamento.id]?.stop();

      const tarefa = cron.schedule(horarioFormatado, async () => {
        FilaController.adicionarNaFila(automacao, agendamento.dataValues.id);

        if (tipo_id == 1) {
          await Agendamento.update(
            { ativo: false },
            {
              where: {
                id: agendamento.id,
              },
            }
          );

          this.tarefasAtivas[id]?.stop();

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

      res
        .status(500)
        .json({ success: false, message: 'Ocorreu um erro interno' });
    }
  };

  deletar = async (req, res) => {
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

      await Agendamento.update({ excluido: true }, { where: { id } });

      if (this.tarefasAtivas[id]) {
        this.tarefasAtivas[id]?.stop();

        delete this.tarefasAtivas[id];

        console.log(`Agendamento ${id} excluído.`);
      }

      res.status(200).json({ message: 'Agendamento excluído.' });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Ocorreu um erro interno' });
    }
  };

  deletarPorAutomacao = async (automacao_id) => {
    try {
      const agendamentos = await Agendamento.findAll({
        where: {
          automacao_id,
        },
      });

      const agendamentos_ids = agendamentos.map(
        (agendamento) => agendamento.dataValues.id
      );

      await Agendamento.update(
        { excluido: true },
        {
          where: {
            id: {
              [Op.in]: agendamentos_ids,
            },
          },
        }
      );

      Object.keys(this.tarefasAtivas).forEach((key) => {
        if (agendamentos_ids.includes(+key)) {
          this.tarefasAtivas[key]?.stop();

          delete this.tarefasAtivas[key];

          console.log(`Agendamento ${key} excluído.`);
        }
      });
    } catch (error) {
      throw error;
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
        this.tarefasAtivas[id]?.stop();

        delete this.tarefasAtivas[id];

        console.log(`Agendamento ${id} cancelado.`);
      }

      res.status(200).json({ message: 'Agendamento cancelado.' });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Ocorreu um erro interno' });
    }
  };
}

module.exports = new AgendamentoController();
