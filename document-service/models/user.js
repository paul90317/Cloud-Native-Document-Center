module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    account: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    passwd: DataTypes.STRING,
    manager: DataTypes.BOOLEAN,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    profile: DataTypes.TEXT,
  }, {
    tableName: 'users'
  });

  return users;
};
