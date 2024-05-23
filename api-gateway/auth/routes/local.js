const router = require('express').Router();

const { signJWT } = require('../utils/auth')
const { sql_file } = require('../utils/mysql')

router.post('/register', (req, res) => {
  if (!req.body || !req.body.account || !req.body.passwd)
    return res.sendStatus(400);
  sql_file('sql/local/register.sql', [req.body.account, req.body.passwd])
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
  sql_file('sql/local/login.sql', [req.body.account, req.body.passwd])
    .then(result => {
      if (result[0].status_code == 200)
        res.setHeader("Authorization", signJWT({ account: req.body.account }))

      return res.sendStatus(result[0].status_code);
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(500)
    })
});

module.exports = router;