const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();
const { GOOGLE_CLIENT_ID, GOOGLE_SECRET_KEY, JWT_SECRET } = process.env;
const { authJWT, sql_execute } = require('../utils')

function get_client(callback_url) {
    return new OAuth2Client({
        clientId: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_SECRET_KEY,
        redirectUri: callback_url
    });
}


function calling(callback_url, res) {
    // generate Google authorization page URL, and define the type of indo in "scope"
    // ref：https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata
    const client = get_client(callback_url)
    const authorizeUrl = client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ],
    });

    res.redirect(authorizeUrl);
}

router.get('/login', (req, res) => {
    calling('http://localhost/google/login/callback', res)
});

router.get('/bind', authJWT, (req, res) => {
    if(!req.user)
        return res.redirect('/google_bind_fail');
    calling('http://localhost/google/bind/callback', res)
});

router.get('/login/callback', async (req, res) => {
    try {
        // use "code" to get the token(google access token)
        const { code } = req.query;
        client = get_client('http://localhost/google/login/callback');
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);

        // get the user info from Google
        const userInfo = await client.request({
            url: 'https://www.googleapis.com/oauth2/v3/userinfo'
        })

        // get login information
        sql_execute('select account from users where email = ?', [userInfo.data.email], result => {
            if (result.length == 1) {
                const token = jwt.sign(result[0], JWT_SECRET); // result[0] = { account : ... }
                res.cookie('token', token)
                res.redirect('/')
            } else {
                res.redirect('/google_login_fail')
            }
        })

    } catch (error) {
        console.log(error)
        res.redirect('/google_login_fail')
    }
});

router.get('/bind/callback', authJWT, async (req, res) => {
    if(!req.user)
        return res.redirect('/google_bind_fail');
    try {
        // use "code" to get the token(google access token)
        const { code } = req.query;
        client = get_client('http://localhost/google/bind/callback');
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);

        // get the user info from Google
        const userInfo = await client.request({
            url: 'https://www.googleapis.com/oauth2/v3/userinfo'
        });

        // save email
        sql_execute('select account from users where email = ?', [userInfo.data.email], result => {
            if (result.length == 0) {
                sql_execute('update users set email = ? where account = ?', [userInfo.data.email, req.user.account])
                res.redirect('/')
            } else {
                res.redirect('/google_bind_fail')
            }
        })
    } catch (error) {
        console.log(error)
        res.redirect('/google_bind_fail')
    }
});

module.exports = router;