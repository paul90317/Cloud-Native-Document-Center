const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

require('dotenv').config();
const { GOOGLE_CLIENT_ID, GOOGLE_SECRET_KEY, CALLBACK_URL, JWT_SECRET } = process.env;

const client = new OAuth2Client({
  clientId: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_SECRET_KEY,
  redirectUri: 'http://localhost/google/callback'
});

router.get('/login', (req, res) => {
  // generate Google authorization page URL, and define the type of indo in "scope"
  // ref：https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata

  const authorizeUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  });
  
  res.redirect(authorizeUrl);
});


router.get('/callback', async (req, res) => {
  try {
    // use "code" to get the token(google access token)
    const { code } = req.query;
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // get the user info from Google
    const userInfo = await client.request({
      url: 'https://www.googleapis.com/oauth2/v3/userinfo'
    });

    // create JWT token
    const token = jwt.sign(userInfo.data, JWT_SECRET);
    res.redirect(`/?token=${token}`)
  } catch (error) {
    console
    res.status(400).send('Error fetching Google user info');
  }
});

module.exports = router;