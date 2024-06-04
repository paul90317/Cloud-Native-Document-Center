const jwt = require('jsonwebtoken');

function verifyJWT(req, res, next) {
  if (!req.headers.authorization)
    return next();
  fetch('http://auth/auth', {
    headers: {
      authorization: req.headers.authorization
    }
  })
    .then(res => {
      if (!res.ok)
        throw new Error(`Http status: ${res.status}`);
      return res.json();
    })
    .then(info => {
      req.user = info;
      next();
    })
    .catch(err => {
      next();
    });
}

module.exports = { verifyJWT }