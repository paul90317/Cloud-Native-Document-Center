const app = require('express')();
const path = require('path')
const { verifyJWT, sql_file, sql_query, verifyCookie } = require('./utils')

app.use(require('body-parser').json())
app.use(require('cookie-parser')())

app.use('/google', require('./routes/google.js'));
app.use('/local', require('./routes/local.js'));

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
})

app.get('/info', verifyJWT, async (req, res) => {
  if (!req.user)
    return res.sendStatus(401);

  sql_file('sql/info.sql', [req.user.account], result => {
    if (!result)
      return res.sendStatus(500);
    user = result[0];
    delete user.passwd;
    res.status(200);
    res.json(user);
  })
})

app.patch('/info', verifyJWT, (req, res) => {
  if (!req.user)
    return res.sendStatus(401)
  if (!req.body)
    return res.sendStatus(400)
  let paras = []
  let format = ''

  for (let k in req.body) {
    if (k != 'name' || k != 'phone' || k != 'profile')
      return res.sendStatus(400);
    paras.push(k)
    paras.push(req.body[k])
    format += '? = ?, '
  }
  if (format.length)
    format = format.substring(0, format.length - 2)
  paras.push(req.user.account)
  sql_query(`update users set ${format} where account = ?`, paras, result => {
    res.sendStatus(200);
  })
})

app.put('/passwd', verifyJWT, (req, res) => {
  if (!req.user)
    return res.sendStatus(401)
  if (!req.body || !req.body.passwd)
    return res.sendStatus(400)
  sql_query(`update users set passwd = ? where account = ?`, [req.user.account, res.body.passwd], result => {
    res.sendStatus(200);
  })
})

app.put('/manager/:account', verifyJWT, (req, res) => {
  if (!req.user)
    return res.sendStatus(401)
  if (!req.params || !req.params.account)
    return res.sendStatus(400)
  const { account } = req.params;
  sql_file('sql/manager.sql', [req.user.account, account], result => {
    if (!result)
      return res.sendStatus(500);
    let status_code = result[0].status_code;
    res.sendStatus(status_code)
  })
})

app.get('/users', verifyJWT, (req, res) => {
  if (!req.user)
    return res.sendStatus(401)
  sql_query('select account, email, name, phone, profile manager from users', [req.user.account], result => {
    if (!result)
      return res.sendStatus(500);
    res.json(result)
  })
})

app.get('/auth', verifyJWT, (req, res) => {
  if (!req.user)
    return res.sendStatus(401)
  res.json(req.user);
})

module.exports = app