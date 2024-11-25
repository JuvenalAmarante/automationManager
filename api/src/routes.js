const { Router } = require('express');

const AutomacaoController = require('./controller/AutomacaoController');
const AgendamentoController = require('./controller/AgendamentoController');
const AutenticacaoController = require('./controller/AutenticacaoController');

const verificarAutenticacao = require('./middlewares/verificarAutenticacao');
const UsuarioController = require('./controller/UsuarioController');
const MenuController = require('./controller/MenuController');
const PermissaoController = require('./controller/PermissaoController');
const verificarAdmin = require('./middlewares/verificarAdmin');
const TipoAgendamentoController = require('./controller/TipoAgendamentoController');

const router = Router();

// Autenticação
router.post('/login', AutenticacaoController.login);

// Menus
router.get('/menus', verificarAutenticacao, MenuController.listar);

// Menus
router.get(
  '/permissoes/validar',
  verificarAutenticacao,
  PermissaoController.validar
);

// Perfil
router.get('/perfil', verificarAutenticacao, UsuarioController.listarDetalhes);

// Agendamentos
router.post(
  '/agendamentos',
  verificarAutenticacao,
  AgendamentoController.criar
);
router.get(
  '/agendamentos',
  verificarAutenticacao,
  AgendamentoController.listar
);
router.get(
  '/agendamentos/automacoes/:id',
  verificarAutenticacao,
  AutomacaoController.listarDetalhes
);
router.get(
  '/agendamentos/tipos',
  verificarAutenticacao,
  TipoAgendamentoController.listar
);
router.patch(
  '/agendamentos/:id',
  verificarAutenticacao,
  AgendamentoController.atualizar
);
router.get(
  '/agendamentos/:id',
  verificarAutenticacao,
  AgendamentoController.listarDetalhes
);
router.get(
  '/agendamentos/:id/logs',
  verificarAutenticacao,
  AgendamentoController.listarLogs
);
router.post(
  '/agendamentos/:id/cancelar',
  verificarAutenticacao,
  AgendamentoController.cancelar
);

// Automações
router.get(
  '/automacoes',
  verificarAutenticacao,
  AutomacaoController.listarFiltrado
);
router.get(
  '/automacoes/tipos-parametros',
  verificarAutenticacao,
  verificarAdmin,
  AutomacaoController.listarTiposParametros
);
router.get(
  '/automacoes/:id',
  verificarAutenticacao,
  AutomacaoController.listarDetalhes
);
router.patch(
  '/automacoes/:id/parametros',
  verificarAutenticacao,
  AutomacaoController.atualizarParametros
);
router.post(
  '/automacoes',
  verificarAutenticacao,
  verificarAdmin,
  AutomacaoController.criar
);
router.delete(
  '/automacoes/:id',
  verificarAutenticacao,
  verificarAdmin,
  AutomacaoController.deletar
);

// Parâmetros
router.get('/parametros/automacoes/:id', AutomacaoController.listarParametros);

module.exports = router;
