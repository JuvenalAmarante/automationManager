const { Sequelize } = require('sequelize');

const configDB = require('../config/database');

const Usuario = require('../models/Usuario');
const Automacao = require('../models/Automacao');
const Agendamento = require('../models/Agendamento');
const ParametroAutomacao = require('../models/ParametroAutomacao');
const TipoParametro = require('../models/TipoParametro');
const TipoAgendamento = require('../models/TipoAgendamento');
const Parametro = require('../models/Parametro');
const LogAgendamento = require('../models/LogAgendamento');
const UsuarioTemAutomacao = require('../models/UsuarioTemAutomacao');
const LogErro = require('../models/LogErro');

const connection = new Sequelize(configDB);

Usuario.init(connection);
UsuarioTemAutomacao.init(connection);
TipoParametro.init(connection);
TipoAgendamento.init(connection);
Automacao.init(connection);
ParametroAutomacao.init(connection);
Parametro.init(connection);
Agendamento.init(connection);
LogAgendamento.init(connection);
LogErro.init(connection);

Usuario.belongsToMany(Automacao, { as: 'Automacoes', through: 'usuarios_tem_automacoes' });

TipoParametro.hasMany(ParametroAutomacao);
TipoAgendamento.hasMany(Agendamento);

Automacao.hasMany(Agendamento);
Automacao.hasMany(ParametroAutomacao);
Automacao.hasMany(Parametro);
Automacao.belongsToMany(Usuario, { as: 'Usuarios', through: 'usuarios_tem_automacoes' });

ParametroAutomacao.belongsTo(TipoParametro, {
  foreignKey: {
    name: 'tipo_parametro_id',
  },
});
ParametroAutomacao.belongsTo(Automacao, {
  foreignKey: {
    name: 'automacao_id',
  },
});

Parametro.belongsTo(Automacao, {
  foreignKey: {
    name: 'automacao_id',
  },
});

Agendamento.hasMany(LogAgendamento);
Agendamento.belongsTo(Automacao, {
  foreignKey: 'automacao_id',
});
Agendamento.belongsTo(TipoAgendamento, {
  foreignKey: {
    name: 'tipo_agendamento_id',
  },
});

LogAgendamento.belongsTo(Agendamento, {
  foreignKey: {
    name: 'agendamento_id',
  },
});

module.exports = connection;
