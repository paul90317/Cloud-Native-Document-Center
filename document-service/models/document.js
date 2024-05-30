module.exports = (sequelize, DataTypes) => {
  const documents = sequelize.define('documents', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    content: DataTypes.TEXT,
    creator: DataTypes.STRING,
    reviewer: DataTypes.STRING,
    status: DataTypes.INTEGER,
    message: DataTypes.TEXT,
  }, {
    timestamps: true,
    tableName: 'documents'
  });


  return documents;
};
