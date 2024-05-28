const multer = require('multer');
const fs = require('fs');
const path = require('path');

// utils modules
const dbHelper = require('../util/dbHelper');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, req.uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, req.filename);
  }
});

const filter = async (req, file, cb) => {
  try {
    // check if the requestor is the same as the account of the user
    req.isAuthorized = true;
    const user = await dbHelper.findUserByEmail(req.email);
    if (user.email !== req.email) {
      req.isAuthorized = false;
      return cb(null, false);
    }

    // only the owner can update the document
    const document = await dbHelper.findDocumentById(req.params.id);
    if (document.creator !== user.account) {
      req.isAuthorized = false;
      return cb(null, false);
    }

    // generate the file paths
    req.uploadDir = 'static/' + user.account + '/';
    req.filename = req.body.docname;
    req.filePath = path.join(req.uploadDir, req.filename);

    // mkdir if the directory does not exist
    if (!fs.existsSync(req.uploadDir)) {
      fs.mkdirSync(req.uploadDir);
    }

    // find the original document
    const originalDoc = await dbHelper.findDocumentById(req.params.id);

    // reject the request if the original document does not exist
    req.fileExists = true;
    if (originalDoc === null) {
      req.fileExists = false;
      return cb(null, false);
    }

    // remove the original document in file system
    const originalFilePath = path.join(req.uploadDir, originalDoc.name);
    fs.unlinkSync(originalFilePath);

    return cb(null, true);
  }
  catch (err) {
    console.error(err);
    return cb(err);
  }
};

// Create the multer instance
const documentUpdator = multer({ storage: storage, fileFilter: filter });

module.exports = documentUpdator;