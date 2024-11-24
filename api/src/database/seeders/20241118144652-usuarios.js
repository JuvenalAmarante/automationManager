'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'usuarios',
      [
        {
          nome: 'Administrador',
          usuario: 'admin',
          senha: 'teste123',
          admin: true,
          ativo: true,
          criado_em: new Date(),
          atualizado_em: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', null, {});
  },
};
