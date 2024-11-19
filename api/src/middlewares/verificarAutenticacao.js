const jwt = require('jsonwebtoken');
const { secret } = require('../config/enviroment');
const UsuarioController = require('../controller/UsuarioController');

function verificarAutenticacao(req, res, next) {
  const token = req.headers['authorization']?.split('Bearer ')?.at(1);

  if (!token) return res.status(401).json({ error: 'Não autorizado.' });

  jwt.verify(token, secret, async function (err, decoded) {
    if (err) {
      console.log(err);

      return res
        .status(500)
        .json({ error: 'Ocorreu um erro ao validar a autenticação.' });
    }

    const usuario = await UsuarioController.buscarUsuarioPorId(decoded.id);

    if (!usuario) return res.status(401).json({ error: 'Não autorizado.' });

    req.userId = decoded.id;
    next();
  });
}

module.exports = verificarAutenticacao;
