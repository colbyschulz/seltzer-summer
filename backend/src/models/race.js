module.exports = (sequelize, DataTypes) => {
  const Race = sequelize.define(
    'Race',
    {
      raceName: DataTypes.STRING,
      raceDate: DataTypes.DATE,
      timeInSeconds: DataTypes.INTEGER,
      distanceInMeters: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    { sequelize, modelName: 'Race' },
  );

  Race.associate = function (models) {
    Race.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };

  return Race;
};
