const app = require('express')();
const proxy = require('express-http-proxy');

app.get('/', async (req, res) => {
    var res2 = await fetch('http://auth/auth', {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${req.query.token}`
        }
    })
    if (res2.status == 401)
        return res.redirect('/google/login')
    
    res.send(await res2.json())
})

app.listen(80);
