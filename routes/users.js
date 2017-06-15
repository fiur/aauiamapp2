const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
    res.render('pages/users');

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


});

module.exports = router;