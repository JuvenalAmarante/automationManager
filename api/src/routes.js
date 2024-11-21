const { Router } = require('express');

const AutomacaoController = require('./controller/AutomacaoController');
const AgendamentoController = require('./controller/AgendamentoController');
const AutenticacaoController = require('./controller/AutenticacaoController');

const verificarAutenticacao = require('./middlewares/verificarAutenticacao');

const router = Router();

// Autenticação
router.post('/login', AutenticacaoController.login);

// Middleware
router.use(verificarAutenticacao)

// Tipos parametros
router.get('/tipos-parametros', AutomacaoController.listarTiposParametro);

// Automações
router.get('/automacoes', AutomacaoController.listar);
router.get('/automacoes/:id', AutomacaoController.listarDetalhes);
router.post('/automacoes', AutomacaoController.criar);

// Agendamentos
router.post('/agendamentos', AgendamentoController.criar);
router.get('/agendamentos', AgendamentoController.listar);
router.get('/agendamentos/:id/logs', AgendamentoController.listarLogs);
router.get('/agendamentos/:id', AgendamentoController.listarDetalhes);
router.post('/agendamentos/:id/cancelar', AgendamentoController.cancelar);

module.exports = router;
