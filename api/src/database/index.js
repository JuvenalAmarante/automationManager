const { Sequelize } = require('sequelize');

const configDB = require('../config/database');

const Usuario = require('../models/Usuario');
const Automacao = require('../models/Automacao');
const Agendamento = require('../models/Agendamento');
const ParametroAutomacao = require('../models/ParametroAutomacao');
const TipoParametro = require('../models/TipoParametro');
const ParametroAgendamento = require('../models/ParametroAgendamento');

const connection = new Sequelize(configDB);

Usuario.init(connection);
TipoParametro.init(connection);
Automacao.init(connection);
ParametroAutomacao.init(connection);
Agendamento.init(connection);
ParametroAgendamento.init(connection);

TipoParametro.hasMany(ParametroAutomacao);

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
Agendamento.belongsTo(Automacao, {
  foreignKey: 'automacao_id',
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

module.exports = connection;
