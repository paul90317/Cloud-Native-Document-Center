module.exports = (sequelize, DataTypes) => {
  const images = sequelize.define('images', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    document: DataTypes.STRING,
    created_time: DataTypes.TIME
  }, {
    tableName: 'images',
    timestamps: false
  });

  return images;
};
