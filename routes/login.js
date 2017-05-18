var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next) {
    //res.render('views/pages/login', { user: req.user });
    res.render('pages/login');
});


///!* Post login request *!/
//router.post('/login', function(req, res, next) {
//    passport.authenticate('local', { failureRedirect: 'pages/login' })
//    res.redirect('pages/');
//});

module.exports = router;


