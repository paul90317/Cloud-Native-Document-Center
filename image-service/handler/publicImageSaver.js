const multer = require('multer');
const fs = require('fs');

const randomGenerator = require('../util/randomGenerator');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("[INFO]: req.uploadDir: ", req.uploadDir);

    uploadDir = 'static/public/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    req.uploadDir = uploadDir;

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    console.log("[INFO]: file: ", file);

    req.filename = randomGenerator(10) + '.' + file.originalname.split('.').pop();

    cb(null, req.filename);
  }
});

// Create the multer instance
const publicImageSaver = multer({ storage: storage });

module.exports = publicImageSaver;
