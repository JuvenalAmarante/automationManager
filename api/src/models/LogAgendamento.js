const { Model, DataTypes } = require('sequelize');

class LogAgendamento extends Model {
  static init(sequelize) {
    super.init(
      {
        possui_erro: DataTypes.BOOLEAN,
        agendamento_id: DataTypes.INTEGER,
        retorno: DataTypes.TEXT,
      },
      {
        sequelize,
        tableName: 'logs_agendamentos',
        createdAt: 'criado_em',
        updatedAt: 'atualizado_em',
      }
    );
  }
}

module.exports = LogAgendamento;
