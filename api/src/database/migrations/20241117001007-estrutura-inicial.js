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
      },
      senha: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ativo: {
        type: Sequelize.BOOLEAN,
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
      horario: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ativo: {
        type: Sequelize.BOOLEAN,
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

    await queryInterface.createTable('parametros_agendamentos', {
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
      parametro_automacao_id: {
        type: Sequelize.INTEGER,
        references: { model: 'parametros_automacoes', key: 'id' },
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('parametros_agendamentos');
    await queryInterface.dropTable('agendamentos');
    await queryInterface.dropTable('parametros_automacoes');
    await queryInterface.dropTable('automacoes');
    await queryInterface.dropTable('tipos_parametros');
    await queryInterface.dropTable('usuarios');

  },
};
