const app = require('express')();
const path = require('path')

app.use(require('body-parser').json())
app.use(require('cookie-parser')())

app.use('/google', require('./routes/google.js'));
app.use('/auth', require('./routes/auth.js'));
app.use('/local', require('./routes/local.js'));

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
})

app.listen(80);