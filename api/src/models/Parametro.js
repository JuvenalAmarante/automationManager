const { Model, DataTypes } = require('sequelize');

class Parametro extends Model {
  static init(sequelize) {
    super.init(
      {
        valor: DataTypes.STRING,
        automacao_id: DataTypes.INTEGER,
      },
      {
        sequelize,
        tableName: 'parametros',
        createdAt: 'criado_em',
        updatedAt: 'atualizado_em',
      }
    );
  }
}

module.exports = Parametro;
