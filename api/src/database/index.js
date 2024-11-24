const { Sequelize } = require('sequelize');

const configDB = require('../config/database');

const Usuario = require('../models/Usuario');
const Automacao = require('../models/Automacao');
const Agendamento = require('../models/Agendamento');
const ParametroAutomacao = require('../models/ParametroAutomacao');
const TipoParametro = require('../models/TipoParametro');
const TipoAgendamento = require('../models/TipoAgendamento');
const ParametroAgendamento = require('../models/ParametroAgendamento');
const LogAgendamento = require('../models/LogAgendamento');

const connection = new Sequelize(configDB);

Usuario.init(connection);
TipoParametro.init(connection);
TipoAgendamento.init(connection);
Automacao.init(connection);
ParametroAutomacao.init(connection);
Agendamento.init(connection);
ParametroAgendamento.init(connection);
LogAgendamento.init(connection);

TipoParametro.hasMany(ParametroAutomacao);
TipoAgendamento.hasMany(Agendamento)

Automacao.hasMany(Agendamento);
Automacao.hasMany(ParametroAutomacao);

ParametroAutomacao.hasMany(ParametroAgendamento);
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

Agendamento.hasMany(ParametroAgendamento);
Agendamento.hasMany(LogAgendamento);
Agendamento.belongsTo(Automacao, {
  foreignKey: 'automacao_id',
});
Agendamento.belongsTo(TipoAgendamento, {
  foreignKey: {
    name: 'tipo_agendamento_id',
  },
});

ParametroAgendamento.belongsTo(Agendamento, {
  foreignKey: {
    name: 'agendamento_id',
  },
});
ParametroAgendamento.belongsTo(ParametroAutomacao, {
  foreignKey: {
    name: 'parametro_automacao_id',
  },
});

LogAgendamento.belongsTo(Agendamento, {
  foreignKey: {
    name: 'agendamento_id',
  },
});

module.exports = connection;
