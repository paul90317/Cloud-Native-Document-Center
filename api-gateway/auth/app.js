const app = require('express')();

app.use('/google', require('./routes/google.js'));
app.use('/auth', require('./routes/auth.js'));

app.listen(80);