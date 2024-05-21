const multer = require('multer');
const fs = require('fs');
const path = require('path');

const dbHelper = require('../util/dbHelper');
const db = require('../models');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    uploadDir = 'static/' + req.account + '/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, req.body.docname);
  }
});

const filter = async (req, file, cb) => {
  const user = await dbHelper.findUserByEmail(req.email);
  req.account = user.account;

  uploadDir = 'static/' + req.account + '/';
  const filePath = path.join(uploadDir, req.body.docname);

  const originalDoc = await dbHelper.findDocumentById(req.params.id);
  if (originalDoc === null) {
    req.fileExists = false;
    cb(null, false);
    return;
  }

  const originalFilePath = path.join(uploadDir, originalDoc.name);
  fs.unlinkSync(originalFilePath);
  req.fileExists = true;

  // write back the new document name to database
  dbHelper.updateDocumentName(req.params.id, req.body.docname);

  cb(null, true);
};

// Create the multer instance
const documentUpdator = multer({ storage: storage, fileFilter: filter });

module.exports = documentUpdator;