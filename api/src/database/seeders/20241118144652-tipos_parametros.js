'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'tipos_parametros',
      [
        {
          id: 1,
          nome: 'Texto',
          criado_em: new Date(),
          atualizado_em: new Date(),
        },
        {
          id: 2,
          nome: 'Número',
          criado_em: new Date(),
          atualizado_em: new Date(),
        },
        {
          id: 3,
          nome: 'Dia',
          criado_em: new Date(),
          atualizado_em: new Date(),
        },
        {
          id: 4,
          nome: 'Mês',
          criado_em: new Date(),
          atualizado_em: new Date(),
        },
        {
          id: 5,
          nome: 'Ano',
          criado_em: new Date(),
          atualizado_em: new Date(),
        },
        {
          id: 6,
          nome: 'Data',
          criado_em: new Date(),
          atualizado_em: new Date(),
        },
        {
          id: 7,
          nome: 'Mês e ano',
          criado_em: new Date(),
          atualizado_em: new Date(),
        },
        {
          id: 8,
          nome: 'Lista de valores',
          criado_em: new Date(),
          atualizado_em: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tipos_parametros', null, {});
  },
};
