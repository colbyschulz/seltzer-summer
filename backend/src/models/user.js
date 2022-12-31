module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    { firstName: DataTypes.STRING, lastName: DataTypes.STRING },
    {
      sequelize,
      modelName: 'User',
    },
  );

  User.associate = function (models) {
    User.hasMany(models.Race, {
      foreignKey: 'userId',
    });
  };

  return User;
};
