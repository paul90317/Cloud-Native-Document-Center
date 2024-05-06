const router = require('express').Router();
const jwt = require('jsonwebtoken')
require('dotenv').config();
const { JWT_SECRET } = process.env;
const { sql_execute } = require('../utils')

router.post('/register', (req, res) => {
    sql_execute('select account from users where account = ?', [req.body.account], result => {
        if (result.length != 0)
            return res.sendStatus(400);
        sql_execute('insert into users (account, passwd) values (?, ?)', [req.body.account, req.body.passwd]);
        res.sendStatus(200)
    })
});

router.post('/login', (req, res) => {
    sql_execute('select account from users where account = ? and passwd = ?', [req.body.account, req.body.passwd], result => {
        if (result.length == 0)
            return res.sendStatus(400);
        token = jwt.sign({ account: req.body.account }, JWT_SECRET);
        res.cookie('token', token)
        res.sendStatus(200)
    })
});

module.exports = router;