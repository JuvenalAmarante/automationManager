const { Router } = require('express');

const AutomacaoController = require('./controller/AutomacaoController');
const AgendamentoController = require('./controller/AgendamentoController');
const AutenticacaoController = require('./controller/AutenticacaoController');

const verificarAutenticacao = require('./middlewares/verificarAutenticacao');
const UsuarioController = require('./controller/UsuarioController');
const MenuController = require('./controller/MenuController');
const PermissaoController = require('./controller/PermissaoController');
const verificarAdmin = require('./middlewares/verificarAdmin');

const router = Router();

// Autenticação
router.post('/login', AutenticacaoController.login);

// Tipos parametros
router.get('/tipos-parametros', AutomacaoController.listarTiposParametro);

// Middleware Autenticação
router.use(verificarAutenticacao)

// Menus
router.get('/menus', MenuController.listar);

// Menus
router.get('/permissoes/validar', PermissaoController.validar);

// Perfil
router.get('/perfil', UsuarioController.listarDetalhes);

// Agendamentos
router.post('/agendamentos', AgendamentoController.criar);
router.get('/agendamentos', AgendamentoController.listar);
router.get('/agendamentos/:id/logs', AgendamentoController.listarLogs);
router.get('/agendamentos/:id', AgendamentoController.listarDetalhes);
router.post('/agendamentos/:id/cancelar', AgendamentoController.cancelar);

// Middleware permissão admin
router.use(verificarAdmin)

// Automações
router.get('/automacoes', AutomacaoController.listar);
router.get('/automacoes/:id', AutomacaoController.listarDetalhes);
router.post('/automacoes', AutomacaoController.criar);
router.delete('/automacoes/:id', AutomacaoController.deletar);

module.exports = router;
