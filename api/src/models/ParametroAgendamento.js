const { Model, DataTypes } = require('sequelize');

class ParametroAgendamento extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: DataTypes.STRING,
        agendamento_id: DataTypes.INTEGER,
        parametro_automacao_id: DataTypes.INTEGER,
      },
      {
        sequelize,
        tableName: 'parametros_automacoes',
        createdAt: 'criado_em',
        updatedAt: 'atualizado_em',
      }
    );
  }
}

module.exports = ParametroAgendamento;
