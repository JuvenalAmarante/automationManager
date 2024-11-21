'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'tipos_agendamentos',
      [
        {
          id: 1,
          nome: 'Sem repetições',
          criado_em: new Date(),
          atualizado_em: new Date(),
        },
        {
          id: 2,
          nome: 'Diária',
          criado_em: new Date(),
          atualizado_em: new Date(),
        },
        {
          id: 3,
          nome: 'Semanal',
          criado_em: new Date(),
          atualizado_em: new Date(),
        },
        {
          id: 4,
          nome: 'Mensal',
          criado_em: new Date(),
          atualizado_em: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tipos_agendamentos', null, {});
  },
};
