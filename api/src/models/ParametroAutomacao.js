const { Model, DataTypes } = require('sequelize');

class ParametroAutomacao extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: DataTypes.STRING,
        automacao_id: DataTypes.INTEGER,
        tipo_parametro_id: DataTypes.INTEGER,
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

module.exports = ParametroAutomacao;
