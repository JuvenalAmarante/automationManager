const { Model, DataTypes } = require('sequelize');

class Usuario extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: DataTypes.STRING,
        usuario: DataTypes.STRING,
        senha: DataTypes.STRING,
        ativo: DataTypes.BOOLEAN,
        admin: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        tableName: 'usuarios',
        createdAt: 'criado_em',
        updatedAt: 'atualizado_em',
      }
    );
  }
}

module.exports = Usuario;
