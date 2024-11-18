const cron = require('node-cron');
const { exec } = require('child_process');

const Automacao = require('../models/Automacao');
const Agendamento = require('../models/Agendamento');
const FilaController = require('./FilaController');

class AgendamentoController {
  tarefasAtivas = {};

  constructor() {
    this.configurar();
  }

  configurar = async () => {
    try {
      const agendamentos = await Agendamento.findAll({
        where: { ativo: true },
        include: [{ model: Automacao }],
      });

      agendamentos.forEach((agendamento) => {
        const { id, horario, Automacao } = agendamento;

        const tarefa = cron.schedule(horario, () => {
          FilaController.adicionarNaFila(Automacao);
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
    const { automacao_id, horario } = req.body;

    if (!automacao_id || !horario)
      return res.status(400).json({ error: 'Campos inválidos' });

    try {
      const automacao = await Automacao.findByPk(automacao_id);

      if (!automacao)
        return res.status(400).json({ error: 'Automação não encontrada' });

      const agendamento = await Agendamento.create({
        automacao_id,
        horario,
        ativo: true,
      });

      const tarefa = cron.schedule(horario, () => {
        FilaController.adicionarNaFila(automacao);
      });

      this.tarefasAtivas[agendamento.id] = tarefa;

      res.status(201).json(agendamento);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  listar = async (req, res) => {
    try {
      const agendamentos = await Agendamento.findAll();

      res.status(200).json(agendamentos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  cancelar = async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(+id))
      return res.status(400).json({ error: 'Agendamento não encontrado' });

    try {
      await Agendamento.update({ status: false }, { where: { id } });

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
