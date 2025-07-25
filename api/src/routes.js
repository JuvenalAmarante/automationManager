const { Router } = require('express');
const rateLimit = require('express-rate-limit');

const verificarAutenticacao = require('./middlewares/verificarAutenticacao');
const verificarAdmin = require('./middlewares/verificarAdmin');

const MenuController = require('./controller/MenuController');
const UsuarioController = require('./controller/UsuarioController');
const AutomacaoController = require('./controller/AutomacaoController');
const AgendamentoController = require('./controller/AgendamentoController');
const AutenticacaoController = require('./controller/AutenticacaoController');
const TipoAgendamentoController = require('./controller/TipoAgendamentoController');
const FilaController = require('./controller/FilaController');

const router = Router();

const throttle = rateLimit({
  windowMs: 5 * 1000,
  max: 1,
  keyGenerator: (req) => {
    return `${req.ip}:${req.originalUrl}`; // separa o controle por rota
  },
  message: {
    success: false,
    message: 'Espere alguns segundos antes de tentar novamente.',
  },
});

// Autenticação
router.post('/login', AutenticacaoController.login);

// Menus
router.get('/menus', verificarAutenticacao, MenuController.listar);

// Perfil
router.get(
  '/perfil',
  verificarAutenticacao,
  UsuarioController.listarDetalhesUsuarioLogado
);

// Agendamentos
router.post(
  '/agendamentos',
  throttle,
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
router.get('/agendamentos/fila', throttle, verificarAutenticacao, FilaController.listar);
router.post(
  '/agendamentos/fila/:id',
  throttle,
  verificarAutenticacao,
  FilaController.encerrarProcesso
);
router.patch(
  '/agendamentos/:id',
  throttle,
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
router.delete(
  '/agendamentos/:id',
  verificarAutenticacao,
  AgendamentoController.deletar
);

// Automações
router.get('/automacoes', verificarAutenticacao, AutomacaoController.listar);
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
  '/automacoes/:id',
  throttle,
  verificarAutenticacao,
  verificarAdmin,
  AutomacaoController.atualizar
);
router.get(
  '/automacoes/:id/parametros',
  verificarAutenticacao,
  AutomacaoController.listarParametros
);
router.patch(
  '/automacoes/:id/parametros',
  throttle,
  verificarAutenticacao,
  AutomacaoController.atualizarParametros
);
router.post(
  '/automacoes',
  throttle,
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

// Usuários
router.post(
  '/usuarios',
  throttle,
  verificarAutenticacao,
  verificarAdmin,
  UsuarioController.criar
);
router.get(
  '/usuarios',
  verificarAutenticacao,
  verificarAdmin,
  UsuarioController.listar
);
router.get(
  '/usuarios/:id',
  verificarAutenticacao,
  verificarAdmin,
  UsuarioController.listarDetalhes
);
router.get(
  '/usuarios/:id/automacoes',
  verificarAutenticacao,
  verificarAdmin,
  UsuarioController.listarAutomacoesVinculadas
);
router.put(
  '/usuarios/:id/automacoes',
  verificarAutenticacao,
  verificarAdmin,
  UsuarioController.atualizarAutomacoesVinculadas
);
router.patch(
  '/usuarios/:id',
  throttle,
  verificarAutenticacao,
  verificarAdmin,
  UsuarioController.atualizar
);

// Parâmetros
router.get(
  '/parametros/automacoes/:id',
  AutomacaoController.listarParametrosFormatados
);

module.exports = router;
