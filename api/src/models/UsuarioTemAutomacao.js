const { Model, DataTypes } = require('sequelize');

class UsuarioTemAutomacao extends Model {
  static init(sequelize) {
    super.init(
      {
        automacao_id: {
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        usuario_id: {
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
      },
      {
        sequelize,
        tableName: 'usuarios_tem_automacoes',
        createdAt: 'criado_em',
        updatedAt: 'atualizado_em',
      }
    );
  }
}

module.exports = UsuarioTemAutomacao;
