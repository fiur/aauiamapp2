const express = require('express');
const router = express.Router();
const util = require('util')



router.get('/', function (req, res, next) {

    Userauth = false;
    profileobj = "none"
    userid = "none";

    res.render('pages/index', {Userauth: Userauth, userid: userid, profileobj: profileobj});

    // dump the user for debugging
});

module.exports = router;

