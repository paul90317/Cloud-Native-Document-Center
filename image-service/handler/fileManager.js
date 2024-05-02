const fs = require('fs');
const mime = require('mime-types');

var FileManager = function () {
};

FileManager.prototype.listFiles = function (email) {
    // List all files of the user
    const dir = 'static/' + email + '/';
    if (!fs.existsSync(dir)) {
        return [];
    }
    const files = fs.readdirSync(dir);
    return files;
}

FileManager.prototype.getMimeType = function (filePath) {
    return mime.lookup(filePath);
}

module.exports = new FileManager();