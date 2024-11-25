const { Model, DataTypes } = require('sequelize');

class ParametroAgendamento extends Model {
  static init(sequelize) {
    super.init(
      {
        valor: DataTypes.STRING,
        agendamento_id: DataTypes.INTEGER,
      },
      {
        sequelize,
        tableName: 'parametros_agendamentos',
        createdAt: 'criado_em',
        updatedAt: 'atualizado_em',
      }
    );
  }
}

module.exports = ParametroAgendamento;
