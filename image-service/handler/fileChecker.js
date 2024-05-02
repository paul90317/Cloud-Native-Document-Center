const jwt = require('jsonwebtoken');
require('dotenv').config();

var FileChecker = function () {
};

FileChecker.prototype.checkFile = function (req, res, next) {
    // check if the file is already exist
    uploadDir = 'static/' + req.email + '/';
    if (!fs.existsSync(uploadDir + req.file.originalname)) {
        res.status(405).send('The file is already exist');
    }
    next();
}

module.exports = new FileChecker();