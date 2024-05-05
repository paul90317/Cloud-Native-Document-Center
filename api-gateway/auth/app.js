const app = require('express')();

app.use('/google', require('./routes/google.js'));
app.use('/auth', require('./routes/auth.js'));

// 監聽 3000 端口
const PORT = 3000;
app.listen(PORT);