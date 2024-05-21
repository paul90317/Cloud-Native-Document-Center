const multer = require('multer');
const fs = require('fs');
const path = require('path');

const randomGenerator = require('../util/randomGenerator');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    uploadDir = 'static/' + req.body.creator + '/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, req.body.docname);
  }
});

const filter = (req, file, cb) => {
  uploadDir = 'static/' + req.body.creator + '/';
  const filePath = path.join(uploadDir, req.body.docname);

  if (fs.existsSync(filePath)) {
    req.fileExists = true;
    cb(null, false); // Reject the file
  } else {
    cb(null, true); // Accept the file
  }
};

// Create the multer instance
const documentSaver = multer({ storage: storage, fileFilter: filter });

module.exports = documentSaver;