module.exports = (sequelize, DataTypes) => {
  const logs = sequelize.define('logs', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    document: DataTypes.INTEGER,
    type: DataTypes.INTEGER,
    ufrom: DataTypes.STRING,
    uto: DataTypes.STRING,
    message: DataTypes.TEXT,
  }, {
    timestamps: true,
    tableName: 'logs'
  });
  return logs;
};
