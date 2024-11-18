const { Model, DataTypes } = require('sequelize');

class TipoParametro extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: 'tipos_parametros',
        createdAt: 'criado_em',
        updatedAt: 'atualizado_em',
      }
    );
  }
}

module.exports = TipoParametro;
