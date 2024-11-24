const Usuario = require('../models/Usuario');

class UsuarioController {
  async buscarUsuarioPorUsuario(usuario) {
    const data = await Usuario.findOne({
      where: {
        usuario,
      },
    });

    return data;
  }

  async buscarUsuarioPorId(id) {
    const data = await Usuario.findByPk(id);

    return data;
  }

  async listarDetalhes(req, res) {
    const { usuario } = req;

    delete usuario.id;

    return res.status(200).json({
      success: true,
      data: usuario,
    });
  }
}

module.exports = new UsuarioController();
