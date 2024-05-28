const fs = require('fs');
const db = require('../models');

async function findUserByEmail(email) {
  return db.sequelize.models.users.findOne({ where: { email: email } });
};

async function findUserByAccount(account) {
  return db.sequelize.models.users.findOne({ where: { account: account } });
}

async function findDocumentById(id) {
  return db.sequelize.models.documents.findOne({ where: { id: id } });
}

async function findDocumentByUser(account) {
  return db.sequelize.models.documents.findAll({ where: { creator: account } });
}

async function findDocumentByName(name) {
  return db.sequelize.models.documents.findOne({ where: { name: name } });
}

async function findAllDocuments() {
  return db.sequelize.models.documents.findAll();
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

async function createRole(document, user, role) {
  return db.sequelize.models.roles.create({
    document: document,
    user: user,
    role: role
  });
}

async function deleteRole(document, user) {
  return db.sequelize.models.roles.destroy({ where: { document: document, user: user } });
}

async function findRole(document, user) {
  return db.sequelize.models.roles.findOne({ where: { document: document, user: user } });
}

async function findRoleByDocument(document) {
  return db.sequelize.models.roles.findAll({ where: { document: document } });
}

async function findRoleByUser(user) {
  return db.sequelize.models.roles.findAll({ where: { user: user } });
}

module.exports = {
  findUserByEmail,
  findUserByAccount,
  findDocumentById,
  findDocumentByUser,
  findDocumentByName,
  findAllDocuments,
  createDocument,
  deleteDocument,
  updateDocumentName,
  createRole,
  deleteRole,
  findRole,
  findRoleByDocument,
  findRoleByUser
};