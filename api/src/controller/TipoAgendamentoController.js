const TipoAgendamento = require('../models/TipoAgendamento');

class TipoAgendamentoController {
  async listar(req, res) {
    const tipos = await TipoAgendamento.findAll();

    return res.status(200).json({
      success: true,
      data: tipos,
    });
  }
}

module.exports = new TipoAgendamentoController();
