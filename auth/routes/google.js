const router = require('express').Router();

const { verifyCookie, signJWT } = require('../utils/auth')
const { sql_file, sql_query } = require('../utils/mysql')

const { OAuth2Client } = require('google-auth-library');

require('dotenv').config();
const { GOOGLE_CLIENT_ID, GOOGLE_SECRET_KEY } = process.env;

function get_client(callback_url) {
  return new OAuth2Client({
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_SECRET_KEY,
    redirectUri: callback_url
  });
}


function auth_url(callback_url) {
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

  return authorizeUrl;
}

const login_redirect_url = 'http://localhost/api/auth/google/login/callback'

router.get('/login', (req, res) => {
  res.redirect(auth_url(login_redirect_url))
});

router.get('/login/callback', async (req, res) => {
  try {
    if (!req.query || !req.query.code)
      return res.sendStatus(400)
    // use "code" to get the token(google access token)
    const { code } = req.query;
    client = get_client(login_redirect_url);
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // get the user info from Google
    var userInfo = await client.request({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo'
    })
  } catch (error) {
    console.log(error)
    return res.redirect(`/login?status_code=401`);
  }

  // get login information
  try {
    let result = await sql_query('SELECT account, email FROM users WHERE email = ?', [userInfo.data.email]);
    if (result.length) {
      const token = signJWT(result[0]).split(' ')[1];
      return res.redirect(`/login?status_code=200&token=${token}`)
    } else {
      var userdata = JSON.stringify({
        account: userInfo.data.email.split('@')[0] + '-' + Math.random().toString(36).substr(2, 9),
        email: userInfo.data.email,
        passwd: Math.random().toString(36).substr(2, 9),
        name: userInfo.data.name,
        profile: 'Hello',
        phone: '*',
      })
      var res2 = await fetch('http://auth/local/register', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: userdata
      })
      let result = await sql_query('SELECT account, email FROM users WHERE email = ?', [userInfo.data.email]);
      const token = signJWT(result[0]).split(' ')[1]; // result[0] = { account : ... }
      res.redirect(`/login?status_code=200&token=${token}`)
    }
  } catch (err) {
    console.log(err);
    res.redirect(`/login?status_code=401`)
  }
});

module.exports = router;