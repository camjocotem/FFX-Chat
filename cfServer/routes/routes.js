var express = require('express');
var router = express.Router();

router.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-Auth, Content-Type, Accept");
    next();
});

router.options('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

router.get('/alive', function (req, res, next) {
    res.status(200).send();
});

module.exports = router;