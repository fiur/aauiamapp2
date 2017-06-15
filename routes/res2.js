const express = require('express');
const router = express.Router();

/* GET Users page */
router.get('/', function (req, res, next) {
    res.render('pages/res2', {
        Userauth:true,
        profileobj: JSON.stringify(req.user, null, 4),
        user: req.user.nameID
    });
});

module.exports = router;