module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Races', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      raceName: {
        type: Sequelize.STRING,
      },
      raceDate: {
        type: Sequelize.DATE,
      },
      distanceInMeters: {
        type: Sequelize.INTEGER,
      },
      timeInSeconds: {
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Races');
  },
};
