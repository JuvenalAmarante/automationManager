const jwt = require('jsonwebtoken');
const { secret } = require('../config/enviroment');
const UsuarioController = require('./UsuarioController');

class AutenticacaoController {
  async login(req, res) {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) res.status(400).json({ error: 'Campos inválidos' });

    try {
      const data = await UsuarioController.buscarUsuarioPorUsuario(usuario);

      if (!data) res.status(400).json({ error: 'Usuário ou senha inválidos' });

      res.status(200).json({
        token: jwt.sign(
          {
            id: data.id,
          },
          secret,
          {
            expiresIn: '1d',
          }
        ),
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AutenticacaoController();
