const jwt = require('jsonwebtoken');
require('dotenv').config();

var Authenticator = function () {
};

Authenticator.prototype.basicAuth = function (req, res, next) {
    // Get auth header value, and trim the redundant string
    const token = req.header('Authorization').replace("Bearer ","");

    // Check if token is undefined
    if (!token) {
        return res.status(401).send('Access Denied');
    }

    try {
        // Verify token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        // If token is invalid, return 400
        res.status(400).send('Invalid Token');
    }
}

Authenticator.prototype.getUserInfo = function (req, res, next) {
    // Get auth header value, and trim the redundant string
    const token = req.header('Authorization').replace("Bearer ","");
    if(req.user) {
        // Get email from token
        if(!jwt.decode(token).email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            res.status(400).send('Invalid Email');
        }
        req.email = jwt.decode(token).email;
        next();
    } else {
        // If token is invalid, return 400
        res.status(400).send('Invalid Token');
    }
}

module.exports = new Authenticator();