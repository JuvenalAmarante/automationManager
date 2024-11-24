const { Model, DataTypes } = require('sequelize');

class Agendamento extends Model {
  static init(sequelize) {
    super.init(
      {
        automacao_id: DataTypes.INTEGER,
        tipo_agendamento_id: DataTypes.INTEGER,
        horario: DataTypes.STRING,
        ativo: DataTypes.BOOLEAN,
        excluido: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        tableName: 'agendamentos',
        createdAt: 'criado_em',
        updatedAt: 'atualizado_em',
      }
    );
  }
}

module.exports = Agendamento;
