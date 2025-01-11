const jwt = require('jsonwebtoken');
const { secret } = require('../config/enviroment');
const UsuarioController = require('./UsuarioController');

class AutenticacaoController {
  async login(req, res) {
    const { usuario, senha } = req.body;

    if (!usuario || !senha)
      return res
        .status(400)
        .json({ success: false, message: 'Campos inválidos' });

    try {
      const data = await UsuarioController.buscarUsuarioPorUsuario(usuario);

      if (!data || senha != data.dataValues.senha)
        return res
          .status(400)
          .json({ success: false, message: 'Usuário ou senha inválidos' });

      res.status(200).json({
        success: true,
        data: {
          token: jwt.sign(
            {
              id: data.id,
            },
            secret,
            {
              expiresIn: '1d',
            }
          ),
        },
      });
    } catch (error) {
      await LogErro.create({
        modulo: 'Autenticacao',
        funcao: 'login',
        retorno: error.message,
      });

      res
        .status(500)
        .json({ success: false, message: 'Ocorreu um erro interno' });
    }
  }
}

module.exports = new AutenticacaoController();
