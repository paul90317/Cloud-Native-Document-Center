module.exports = (sequelize, DataTypes) => {
  const documents = sequelize.define('documents', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    creator: DataTypes.STRING,
    reviewer: DataTypes.STRING,
    status: DataTypes.INTEGER,
    message: DataTypes.TEXT,
  }, {
    tableName: 'documents'
  });


  return documents;
};
