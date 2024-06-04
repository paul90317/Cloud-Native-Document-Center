const jwt = require('jsonwebtoken');
const axios = require('axios');

// utils modules
const dbHelper = require('../util/dbHelper');
const db = require('../models');

var Authenticator = function () {
};

Authenticator.prototype.basicAuth = function (req, res, next) {
  // Get auth header value, and trim the redundant string
  const token = req.header('Authorization').replace("Bearer ", "");

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
  const token = req.header('Authorization').replace("Bearer ", "");

  if (req) {
    // Get email from token
    if (!jwt.decode(token).email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
      res.status(400).send('Invalid Email');
    }
    req.email = jwt.decode(token).email;
    next();
  } else {
    // If token is invalid, return 400
    res.status(400).send('Invalid Token');
  }
}

Authenticator.prototype.getInfoFromAuthService = async function (req, res, next) {
  // Get auth header value, and trim the redundant string
  const token = req.header('Authorization').replace("Bearer ", "");

  try {
    const response = await axios.get('https://gcp-auth-service-5hia7fk4na-uc.a.run.app/auth', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    try {
      const user = await dbHelper.findUserByAccount(response.data.account);
      req.email = user.email;
      next();
    } catch (dbError) {
      // Handle errors when querying the database
      console.error('Database error:', dbError);
      res.status(500).send('Internal Server Error');
    }
  } catch (error) {
    // If token is invalid, or axios call fails, return 400
    console.error('Axios error:', error);
    res.status(400).send('Invalid Token');
  }
}


module.exports = new Authenticator();