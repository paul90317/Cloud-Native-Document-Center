module.exports = (sequelize, DataTypes) => {
  const roles = sequelize.define('roles', {
    document: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    user: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    role: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    }
  }, {
    timestamps: true,
    tableName: 'roles'
  });
  return roles;
};
