const router = require('express').Router();

const { signJWT } = require('../utils/auth')
const { sql_file, sql_query } = require('../utils/mysql')

router.post('/register', (req, res) => {
  if (!req.body || !req.body.account || !req.body.passwd || !req.body.email || !req.body.name || !req.body.phone || !req.body.profile)
    return res.sendStatus(400);
  sql_file('sql/local/register.sql', [req.body.account, req.body.passwd, req.body.email, req.body.name, req.body.phone, req.body.profile])
    .then(result => {
      res.sendStatus(result[0].status_code);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    })
});

router.post('/login', (req, res) => {
  if (!req.body || !req.body.account || !req.body.passwd)
    return res.sendStatus(400);
  sql_query('select account, email from users where account = ? and passwd = ?', [req.body.account, req.body.passwd])
    .then(result => {
      if (result.length)
        return res.setHeader("Authorization", signJWT(result[0])).sendStatus(200);

      res.sendStatus(401);
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(500)
    })
});

module.exports = router;