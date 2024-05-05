const router = require('express').Router();
const jwt = require('jsonwebtoken')
require('dotenv').config();
const { JWT_SECRET } = process.env;

// express callback function
function authJWT(req, res, next) {
    try{
        const token = req.header('Authorization').replace("Bearer ","");
        var user = jwt.verify(token, JWT_SECRET);
        req.user = user;
        next();
    }catch (error){
        res.sendStatus(401);
    }
}

router.get('/', authJWT, (req, res) => {
    res.json(req.user);
});

module.exports = router;