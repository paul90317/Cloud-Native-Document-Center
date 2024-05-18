module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    account: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    passwd: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    profile: DataTypes.TEXT,
    manager: DataTypes.BOOLEAN,
    created_time: DataTypes.DATE,
  }, {
    timestamps: false,
    tableName: 'users'
  });

  return users;
};
