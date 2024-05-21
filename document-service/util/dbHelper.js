const fs = require('fs');
const db = require('../models');

async function findUserByEmail(email) {
  return db.sequelize.models.users.findOne({ where: { email: email } });
};

async function findDocumentById(id) {
  return db.sequelize.models.documents.findOne({ where: { id: id } });
}

async function updateDocumentName(id, name) {
  return db.sequelize.models.documents.update({ name: name }, { where: { id: id } });
}

module.exports = { findUserByEmail, findDocumentById, updateDocumentName };