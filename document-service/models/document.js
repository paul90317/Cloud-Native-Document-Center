module.exports = (sequelize, DataTypes) => {
  const documents = sequelize.define('documents', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    creator: DataTypes.STRING,
    description: DataTypes.TEXT,
    title: DataTypes.STRING,
    changed_time: DataTypes.DATE,
    created_time: DataTypes.DATE,
  }, {
    timestamps: false,
    tableName: 'documents'
  });


  return documents;
};
