const express = require('express');
const router = express.Router();

const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { GOOGLE_CLIENT_ID, GOOGLE_SECRET_KEY, JWT_SECRET, HOST } = process.env;

const client = new OAuth2Client({
  clientId: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_SECRET_KEY,
  redirectUri: `${HOST}/callback`,
});


router.post('/login', (req, res) => {
  // generate Google authorization page URL, and define the type of indo in "scope"
  // ref：https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata
  const authorizeUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  });

  // reidrect to Google authorization page
  res.redirect(authorizeUrl); 
});


router.get('/callback', async (req, res) => {
  const { code } = req.query;

  try {
    // use "code" to get the token(google access token)
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // get the user info from Google
    const userInfo = await client.request({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo'
    });

    // create JWT token
    const token = jwt.sign(userInfo.data, JWT_SECRET);
    console.log("[INFO]: JWT: ", token);
    // store the token in cookie
    res.cookie('token', token);
    res.redirect('/'); 
  } catch (error) {
    console.error(error);
    res.status(400).send('Error fetching Google user info');
  }
});

// authenticate the JWT from the user
function authenticateJWT(req, res, next) {
  const token = req.header('Authorization');
  console.log(token);

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next(); // callback function
    });
  } else {
    res.sendStatus(401);
  }
}

router.get('/user', authenticateJWT, async (req, res) => {
  try {
    // get the user info from Google
    const userInfo = await client.request({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo',
    });
    res.json(userInfo.data);
  } catch (error) {
    console.error(error);
    res.status(400).send('Error fetching user info');
  }
});

module.exports = router;