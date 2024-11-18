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
}

module.exports = new UsuarioController();
