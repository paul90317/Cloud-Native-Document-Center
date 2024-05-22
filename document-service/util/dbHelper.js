const fs = require('fs');
const db = require('../models');

async function findUserByEmail(email) {
  return db.sequelize.models.users.findOne({ where: { email: email } });
};

async function findDocumentById(id) {
  return db.sequelize.models.documents.findOne({ where: { id: id } });
}

async function findDocumentsByUser(account) {
  return db.sequelize.models.documents.findAll({ where: { creator: account } });
}

async function createDocument(name, creator, status) {
  return db.sequelize.models.documents.create({
    name: name,
    creator: creator,
    reviewer: creator,
    status: status,
    message: ''
  });
}

async function deleteDocument(id) {
  return db.sequelize.models.documents.destroy({ where: { id: id } });
}

async function updateDocumentName(id, name) {
  return db.sequelize.models.documents.update({ name: name }, { where: { id: id } });
}

module.exports = {
  findUserByEmail,
  findDocumentById,
  findDocumentsByUser,
  createDocument,
  deleteDocument,
  updateDocumentName
};