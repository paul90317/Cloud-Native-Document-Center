const router = require('express').Router();
const { signJWT, sql_file } = require('../utils')
router.post('/register', (req, res) => {
  if (!req.body || !req.body.account || !req.body.passwd)
    return res.sendStatus(400);
  sql_file('sql/local/register.sql', [req.body.account, req.body.passwd], result => {
    if (!result)
      return res.sendStatus(500);
    return res.sendStatus(result[0].status_code);
  });
});

router.post('/login', (req, res) => {
  if (!req.body || !req.body.account || !req.body.passwd)
    return res.sendStatus(400);
  sql_file('sql/local/login.sql', [req.body.account, req.body.passwd], result => {
    if (!result)
      return res.sendStatus(500);
    if (result[0].status_code == 200)
      res.setHeader("Authorization", signJWT({ account: req.body.account }))

    return res.sendStatus(result[0].status_code);
  });
});

module.exports = router;