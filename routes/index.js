const express = require('express');
const router = express.Router();
const util = require('util')



router.get('/', function (req, res, next) {
    console.log(util.inspect(req.user, {showHidden: false, depth: null}))

    var saml = JSON.stringify(req.user, null, 4);
    var json = JSON.parse(saml);

    Userauth = false;
    profileobj = JSON.stringify(req.user, null, 4);
    userid = json["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"];

    res.render('pages/res1', { userid: userid, profileobj: profileobj});

    // dump the user for debugging
});

module.exports = router;

