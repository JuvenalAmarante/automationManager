const { Model, DataTypes } = require('sequelize');

class LogErro extends Model {
  static init(sequelize) {
    super.init(
      {
        modulo: DataTypes.STRING,
        funcao: DataTypes.STRING,
        retorno: DataTypes.TEXT,
      },
      {
        sequelize,
        tableName: 'logs_erros',
        createdAt: 'criado_em',
        updatedAt: 'atualizado_em',
      }
    );
  }
}

module.exports = LogErro;
