const jwt = require('jsonwebtoken');
const { secret } = require('../config/enviroment');
const UsuarioController = require('../controller/UsuarioController');

function verificarAutenticacao(req, res, next) {
  const token = req.headers['authorization']?.split('Bearer ')?.at(1);

  if (!token)
    return res.status(401).json({ success: false, message: 'Não autorizado.' });

  jwt.verify(token, secret, async function (err, decoded) {
    if (err) {
      console.log(err);

      return res.status(401).json({
        success: false,
        message: 'Não autorizado.',
      });
    }

    const usuario = await UsuarioController.buscarUsuarioPorId(decoded.id);

    if (!usuario || !usuario.dataValues.ativo)
      return res
        .status(401)
        .json({ success: false, message: 'Não autorizado.' });

    req.usuario = {
      id: usuario.dataValues.id,
      nome: usuario.dataValues.nome,
      admin: usuario.dataValues.admin,
    };

    next();
  });
}

module.exports = verificarAutenticacao;
