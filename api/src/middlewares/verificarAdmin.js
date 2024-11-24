function verificarAdmin(req, res, next) {
  if (!req.usuario.admin) {
    return res.status(403).json({
      success: false,
      message: 'O usuário não possui permissão para acessar.',
    });
  }

  next();
}

module.exports = verificarAdmin;
