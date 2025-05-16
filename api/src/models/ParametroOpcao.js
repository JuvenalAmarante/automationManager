const { Model, DataTypes } = require('sequelize');

class ParametroOpcao extends Model {
  static init(sequelize) {
    super.init(
      {
        valor: DataTypes.STRING,
        parametro_automacao_id: DataTypes.INTEGER,
      },
      {
        sequelize,
        tableName: 'parametros_opcoes',
        createdAt: 'criado_em',
        updatedAt: 'atualizado_em',
      }
    );
  }
}

module.exports = ParametroOpcao;
