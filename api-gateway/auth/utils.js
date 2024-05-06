require('dotenv').config();
const { JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

// express callback function
function authJWT(req, res, next) {
    try {
        const token = req.cookies.token
        var user = jwt.verify(token, JWT_SECRET);
        req.user = user;
    } catch (error) {
        console.log(error)
    }
    next();
}

const mysql = require('mysql2')
function sql_execute(sql, paras = [], callbackf = res => { }) {
    const conn = mysql.createConnection({
        host: 'mysql',
        user: 'root',
        password: 'root',
        database: 'doc_center'
    });
    conn.execute(sql, paras, (err, result) => {
        if (!err)
            callbackf(result);
    })
}

module.exports = { authJWT, sql_execute }