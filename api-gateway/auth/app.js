const app = require('express')();
const path = require('path')
const { verifyJWT, sql_file } = require('./utils')

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
    res.json(user);
  })
})

app.listen(80);