const router = require('express').Router();
const { OAuth2Client } = require('google-auth-library');
const { verifyCookie, sql_file, signJWT } = require('../utils')
require('dotenv').config();
const { GOOGLE_CLIENT_ID, GOOGLE_SECRET_KEY } = process.env;

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

router.get('/bind', verifyCookie, (req, res) => {
  if (!req.user)
    return res.sendStatus(401);
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
    var userInfo = await client.request({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo'
    })
  } catch (error) {
    console.log(error)
    return res.sendStatus(401);
  }

  // get login information
  sql_file('sql/google/login.sql', [userInfo.data.email], result => {
    if (!result)
      return res.sendStatus(500);
    console.log(result);
    if (result.length) {
      const token = signJWT(result[0]).split(' ')[1]; // result[0] = { account : ... }
      res.cookie('token', token)
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  })
});

router.get('/bind/callback', verifyCookie, async (req, res) => {
  try {
    if (!req.user)
      return res.sendStatus(401);
    const { code } = req.query;
    client = get_client('http://localhost/google/bind/callback');
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // get the user info from Google
    var userInfo = await client.request({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo'
    });
  } catch (error) {
    console.log(error)
    res.sendStatus(401);
  }

  sql_file('sql/google/bind.sql', [req.user.account, userInfo.data.email], result => {
    if (!result)
      return res.sendStatus(500);
    res.sendStatus(result[0].status_code)
  })
});

module.exports = router;