const router = require('express').Router();
const jwt = require('jsonwebtoken')
const { authJWT } = require('../utils')

router.get('/', authJWT, (req, res) => {
    res.json(req.user);
});

module.exports = router;