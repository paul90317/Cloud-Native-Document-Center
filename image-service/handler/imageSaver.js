const multer = require('multer');
const fs = require('fs');

const randomGenerator = require('../util/randomGenerator');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    uploadDir = 'static/' + req.email + '/';
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, randomGenerator(10) + '.' + file.originalname.split('.').pop());
  }
});

// Create the multer instance
const imageSaver = multer({ storage: storage });

module.exports = imageSaver;