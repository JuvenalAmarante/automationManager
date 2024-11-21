const { Model, DataTypes } = require('sequelize');

class TipoAgendamento extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: 'tipos_agendamentos',
        createdAt: 'criado_em',
        updatedAt: 'atualizado_em',
      }
    );
  }
}

module.exports = TipoAgendamento;
