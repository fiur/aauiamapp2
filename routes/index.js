const express = require('express');
const router = express.Router();
const util = require('util')



router.get('/', function (req, res, next) {
    console.log(util.inspect(req.user, {showHidden: false, depth: null}))

if(req.user == null)
    {
        req.user ="none";

        Userauth = false;
        profileobj = JSON.stringify(req.user, null, 4);
        userid = "none";
    }
    else{
        Userauth = true;
        profileobj = JSON.stringify(req.user, null, 4);
        userid =  req.user.nameID;
    }

    res.render('pages/index', {
        Userauth:Userauth,
        profileobj: profileobj,
        user: userid
        });
    // dump the user for debugging
});

module.exports = router;

