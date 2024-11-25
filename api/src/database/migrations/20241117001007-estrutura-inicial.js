'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      usuario: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      senha: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ativo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      criado_em: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      atualizado_em: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('tipos_parametros', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      criado_em: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      atualizado_em: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('tipos_agendamentos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      criado_em: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      atualizado_em: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('automacoes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      arquivo: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      excluido: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      criado_em: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      atualizado_em: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('parametros_automacoes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      automacao_id: {
        type: Sequelize.INTEGER,
        references: { model: 'automacoes', key: 'id' },
      },
      tipo_parametro_id: {
        type: Sequelize.INTEGER,
        references: { model: 'tipos_parametros', key: 'id' },
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      qtd_digitos: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      criado_em: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      atualizado_em: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });


    await queryInterface.createTable('parametros', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      automacao_id: {
        type: Sequelize.INTEGER,
        references: { model: 'automacoes', key: 'id' },
      },
      valor: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      criado_em: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      atualizado_em: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('agendamentos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      automacao_id: {
        type: Sequelize.INTEGER,
        references: { model: 'automacoes', key: 'id' },
      },
      tipo_agendamento_id: {
        type: Sequelize.INTEGER,
        references: { model: 'tipos_agendamentos', key: 'id' },
      },
      horario: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      excluido: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      ativo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      criado_em: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      atualizado_em: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.createTable('logs_agendamentos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      agendamento_id: {
        type: Sequelize.INTEGER,
        references: { model: 'agendamentos', key: 'id' },
      },
      possui_erro: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      retorno: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      criado_em: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      atualizado_em: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('logs_agendamentos');
    await queryInterface.dropTable('agendamentos');
    await queryInterface.dropTable('parametros');
    await queryInterface.dropTable('parametros_automacoes');
    await queryInterface.dropTable('automacoes');
    await queryInterface.dropTable('tipos_agendamentos');
    await queryInterface.dropTable('tipos_parametros');
    await queryInterface.dropTable('usuarios');
  },
};
