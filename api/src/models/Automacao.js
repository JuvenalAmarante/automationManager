const { Model, DataTypes } = require('sequelize');

class Automacao extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: DataTypes.STRING,
        arquivo: DataTypes.STRING,
        excluido: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        tableName: 'automacoes',
        createdAt: 'criado_em',
        updatedAt: 'atualizado_em',
      }
    );
  }
}

module.exports = Automacao;
