var express = require('express');
var router = express.Router();

const fs = require('fs');

const authenticator = require('../handler/authenticator');
const imageSaver = require('../handler/imageSaver');
const fileManager = require('../handler/fileManager');

/* GET user's file names */
// This route is used to get the names of the files that the user has uploaded.
//
// Request Authentication
// Bearer token: jwt
router.get('/names', authenticator.getUserInfo, (req, res) => {
  console.log(req.email);
  const files = fileManager.listFiles(req.email)
  res.send(files);
});

/* GET user's file */
// This route is used to download the file that the user has uploaded.
//
// Request Authentication
// Bearer token: jwt
//
// Request route parameters
// name: The name of the file to download
router.get('/file/:name', authenticator.getUserInfo, (req, res) => {
  const filePath = 'static/' + req.email + '/' + req.params.name;
  if(!fs.existsSync(filePath)) {
    res.sendStatus(404).send('File not found');
  }
  res.download(filePath);
});

/* POST upload image */
// This route is used to upload an image.
//
// Request Authentication
// Bearer token: jwt
//
// Request body:
// file: The image file to upload, must be in PNG or JPEG format
router.post('/', authenticator.getUserInfo, imageSaver.single('file'), (req, res) => {
  const mimetype = fileManager.getMimeType(req.file.path);
  const validMimetype = ['image/png', 'image/jpeg'];
  if(!validMimetype.includes(mimetype)) {
    res.sendStatus(415).send('Unsupported media type');
  }
  res.sendStatus(200);
});

module.exports = router;
