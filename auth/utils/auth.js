const jwt = require('jsonwebtoken');

// const JWT_SECRET = Math.random().toString(36).substr(2, 9)
const JWT_SECRET = process.env.JWT_SECRET

// express callback function
function verifyJWT(req, res, next) {
  try {
    if (!req.headers.authorization)
      return next();
    let auths = req.headers.authorization.split(' ')
    if (auths.length != 2)
      return next();
    const token = auths[1]
    var user = jwt.verify(token, JWT_SECRET);
    req.user = user;
  } catch (error) {
    console.log(error)
  }
  next();
}

function verifyCookie(req, res, next) {
  try {
    if (!req.cookies || !req.cookies.token)
      return next()
    const token = req.cookies.token
    var user = jwt.verify(token, JWT_SECRET);
    req.user = user;
  } catch (error) {
    console.log(error)
  }
  next();
}

function signJWT(jsondata) {
  return `Bearer ${jwt.sign(jsondata, JWT_SECRET)}`;
}

module.exports = { verifyJWT, signJWT, verifyCookie }