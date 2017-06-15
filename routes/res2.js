const express = require('express');
const router = express.Router();

/* GET Users page */
router.get('/', function (req, res, next) {

    var saml = JSON.stringify(req.user, null, 4);
    var json = JSON.parse(saml);

    Userauth = false;
    profileobj = JSON.stringify(req.user, null, 4);
    userid = json["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"];

    res.render('pages/res2', { userid: userid});

});

module.exports = router;