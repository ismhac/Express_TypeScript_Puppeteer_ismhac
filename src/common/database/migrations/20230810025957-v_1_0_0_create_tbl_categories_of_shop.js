'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'tbl_categories_of_shop',
        {
          id: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
          },
          shop_id: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'tbl_shops',
              key: 'id',
            },
          },
          title: {
            type: Sequelize.DataTypes.STRING
          },
          link: {
            type: Sequelize.DataTypes.STRING
          },
          created_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.DataTypes.NOW,
          },
          updated_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.DataTypes.NOW,
          },
          deleted_at: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
          },
        },
        {
          transaction,
        },
      )
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('tbl_drivers_of_race', { transaction })
    })
  }
};
