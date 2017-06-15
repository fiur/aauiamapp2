const express = require('express');
const router = express.Router();
const util = require('util')



router.get('/', function (req, res, next) {
    console.log(util.inspect(req.user, {showHidden: false, depth: null}))

if(req.user == null)
    {
        req.user ="none";
        var saml = ' {"issuer": "http://aauiamapp.dk/adfs/services/trust", "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "sz@aauiamapp.dk", "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": "sz@app.dk", "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname": "sorin" }';
        Userauth = false;
        profileobj = JSON.stringify(req.user, null, 4);
        userid = "none";
    }
    else{
        Userauth = true;
        profileobj = JSON.stringify(req.user, null, 4);
        userid =  saml.user;
    }

    res.render('pages/index', {
        Userauth:Userauth,
        profileobj: profileobj,
        user: userid
        });
    // dump the user for debugging
});

module.exports = router;

