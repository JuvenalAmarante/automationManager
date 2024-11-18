'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'tipos_parametros',
      [
        {
          nome: 'Texto',
          criado_em: new Date(),
          atualizado_em: new Date(),
        },
        {
          nome: 'Data',
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
