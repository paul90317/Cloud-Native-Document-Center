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
    // check if the creator is the same as the account of the user
    req.isAuthorized = true;
    const user = await dbHelper.findUserByEmail(req.email);
    if (!user || user.account !== req.body.creator) {
      req.isAuthorized = false;
      return cb(null, false);
    }

    // generate the file paths
    req.uploadDir = 'static/' + req.body.creator + '/';
    req.filename = req.body.docname;
    req.filePath = path.join(req.uploadDir, req.filename);

    // mkdir if the directory does not exist
    if (!fs.existsSync(req.uploadDir)) {
      fs.mkdirSync(req.uploadDir);
    }

    // check if the file already exists
    if (fs.existsSync(req.filePath)) {
      req.fileExists = true;
      return cb(null, false); // Reject the file
    } else {
      return cb(null, true); // Accept the file
    }
  }
  catch (err) {
    console.error(err);
    return cb(err);
  }
};

// Create the multer instance
const documentSaver = multer({ storage: storage, fileFilter: filter });

module.exports = documentSaver;