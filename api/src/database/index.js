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

class Connection {
  connection;
  isConnected = false;

  constructor() {
    this.connection = new Sequelize(configDB);

    this.validar();

    // this.connection.query = async function() {
    //   try {
    //     return await Sequelize.prototype.query.apply(this, arguments);
    //   } catch (err) {
    //     if (err instanceof Sequelize.ConnectionError) {
    //       console.log('deu ruim')
    //     } else if (err instanceof Sequelize.TimeoutError) { 
    //       console.log('deu timeout')
    //       // Do something
    //     } else {
    //       throw err;
    //     }
    //   }
    // };
  }

  validar = () => {
    const interval = setInterval(async () => {
      if (!this.isConnected) await this.iniciar();

      if (this.isConnected) clearInterval(interval);
    }, 10 * 1000);
  };

  iniciar = async () => {
    try {
      await this.connection.authenticate();

      this.isConnected = true;

      console.log('Conectado ao banco');

      this.configurar();
    } catch (error) {
      console.error('Ocorreu um erro:', error);

      this.isConnected = false;
    }
  };

  configurar = () => {
    Usuario.init(this.connection);
    UsuarioTemAutomacao.init(this.connection);
    TipoParametro.init(this.connection);
    TipoAgendamento.init(this.connection);
    Automacao.init(this.connection);
    ParametroAutomacao.init(this.connection);
    Parametro.init(this.connection);
    Agendamento.init(this.connection);
    LogAgendamento.init(this.connection);
    LogErro.init(this.connection);

    Usuario.belongsToMany(Automacao, {
      as: 'Automacoes',
      through: 'usuarios_tem_automacoes',
    });

    TipoParametro.hasMany(ParametroAutomacao);
    TipoAgendamento.hasMany(Agendamento);

    Automacao.hasMany(Agendamento);
    Automacao.hasMany(ParametroAutomacao);
    Automacao.hasMany(Parametro);
    Automacao.belongsToMany(Usuario, {
      as: 'Usuarios',
      through: 'usuarios_tem_automacoes',
    });

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
  }
}

module.exports = new Connection();
