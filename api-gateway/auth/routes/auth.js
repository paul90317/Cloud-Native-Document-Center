const router = require('express').Router();
const jwt = require('jsonwebtoken')
const { authJWT } = require('../utils')

router.get('/', authJWT, (req, res) => {
    if(req.user)
        res.json(req.user);
    else
        res.sendStatus(401);
});

module.exports = router;