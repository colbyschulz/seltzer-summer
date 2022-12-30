import { DataTypes } from 'sequelize';

const Race = (sequelize) =>
  sequelize.define(
    'Race',
    {
      // Model attributes are defined here
      raceName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      timeInSeconds: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      raceDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      // Other model options go here
    },
  );

export default Race;
