const jwt = require('jsonwebtoken');
const fs = require('fs');
const mysql = require('mysql2');

JWT_SECRET = Math.random().toString(36).substr(2, 9)

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

function sql_query(sql, paras = [], callbackf = res => { }) {
  const conn = mysql.createConnection({
    host: 'mysql',
    user: 'root',
    password: 'root',
    database: 'doc_center'
  });
  conn.execute(sql, paras, (err, result) => {
    if (err) {
      console.log(err);
      callbackf(undefined);
    }
    else {
      callbackf(result);
    }
  })
}

function sql_next(conn, transactions, paras, callbackf, i = 0) {
  if (i < transactions.length - 1)
    conn.query(transactions[i], paras, (err, result) => {
      if (err) {
        console.log(err);
        callbackf(undefined);
      }
      else
        sql_next(conn, transactions, paras, callbackf, i + 1);
    })
  else if (i == transactions.length - 1)
    conn.query(transactions[i], paras, (err, result) => {
      if (err) {
        console.log(err);
        callbackf(undefined);
      }
      else
        callbackf(result);
    })
}

function sql_file(sql_fn, paras = [], callbackf = result => { }) {
  try {
    const conn = mysql.createConnection({
      host: 'mysql',
      user: 'root',
      password: 'root',
      database: 'doc_center'
    });
    let sql = fs.readFileSync(sql_fn, 'utf-8')
    let sqls = sql.split(';')
    let transactions = []
    for (var s of sqls)
      if (s.trim().length > 0)
        transactions.push(s)

    sql_next(conn, transactions, paras, callbackf)
  } catch (err) {
    console.log(err);
    callbackf(undefined);
  }
}

module.exports = { verifyJWT, signJWT, sql_query, sql_file, verifyCookie }