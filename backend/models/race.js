module.exports = (sequelize, DataTypes) => {
  const Race = sequelize.define(
    'Race',
    {
      raceName: DataTypes.STRING,
      raceDate: DataTypes.DATE,
      timeInSeconds: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    { sequelize, modelName: 'Race' },
  );

  Race.associate = function (models) {
    console.log('race assocaite models:', models);
    Race.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };

  return Race;
};
