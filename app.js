// dependencies
var express = require('express');
var logger = require('morgan');
var path = require('path');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var app = express();
var router = express.Router();
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var bodyParser = require('body-parser');
var SamlStrategy = require('passport-saml').Strategy;
var fs = require('fs');
var soap = require('soap');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));



// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({keys: ['secretkey1', 'secretkey2', '...']}));


// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new SamlStrategy(
    {
        //path: '/login/callback',
        //entryPoint: 'https://aauiamapp.dk/adfs/ls',
        issuer: 'https://app2.aauiamapp.dk/',
        entryPoint: 'https://aauiamapp.dk/adfs/ls/',
        callbackUrl: 'https://app2.aauiamapp.dk/login/callback',
        //privateCert: fs.readFileSync('../App2_private.pem', 'utf-8'),
        //cert: fs.readFileSync('../b64_aauiamapp_public.cer', 'utf-8'),
        // other authn contexts are available e.g. windows single sign-on
        authnContext: 'http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/password',
        // not sure if this is necessary?
        acceptedClockSkewMs: -1,
        identifierFormat: null,
    },
    function(profile, done){
        console.log('Profile: %j', profile);
        return done(null, profile);
    })
);


// simple logger for this router's requests
// all requests to this router will first hit this middleware
router.use(function(req, res, next) {
    console.log('%s %s %s', req.method, req.url, req.path);
    next();
});

router.use(logger());
router.use(express.static(__dirname + '/public'));
router.use(function(req, res){
    res.send('Hello');
});


app.get('/login',
    passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
    function(req, res) {
        res.redirect('/');
    }
);

app.post('/login/callback',
    passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
    function(req, res) {
        console.log("The callback function have been hit")
        res.redirect('/');
    }
);


// Define routes
var index = require('./routes/index');
//var login = require('./routes/login');
var users = require('./routes/users');
var register = require('./routes/register');
var prohibited = require('./routes/prohibited');
var res1 = require('./routes/res1');
var res2 = require('./routes/res2');
var res3 = require('./routes/res3');

// Simple middleware to ensure user is authenticated.
// Use this middleware on any resource that needs to be protected.
// If the request is authenticated (typically via a persistent login session),
// the request will proceed.  Otherwise, the user will be redirected to the
// login page.



function ensureAuthN(req, res, next) {
    if (req.isAuthenticated()) {
        console.log("The user is logged in");
        // req.user is available for use here
        return next(); }
    console.log("The user is not logged in and redirected to login");
    // denied. redirect to login
    res.redirect('/login')
}

function ensureAuthZ(req, res, next) {

    var url = 'https://www.aauiamapp.dk:9443/services/EntitlementService?wsdl';
    var args = {
        subject:'professor1',
        resource:'/researchCMI',
        action:'GET'
    };

    soap.createClient(url, function(err, client) {
        client.setSecurity(new soap.BasicAuthSecurity('admin', 'admin'));
        client.getDecisionByAttributes(args, function(err, result) {
            console.log(result);
        });
    });
    return next();
}

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';




// Mapping all url to file
app.use('/', index);
//app.use('/login', login);
app.use('/users', ensureAuthN, ensureAuthZ, users);
app.use('/register', ensureAuthN, ensureAuthZ, register);
app.use('/res1', ensureAuthN, ensureAuthZ, res1);
app.use('/res2', ensureAuthN, ensureAuthZ, res2);
app.use('/res3', res3);


app.get('/logout', function(req, res){
    console.log('logging out');
    req.logout();
    res.redirect('/');
});


module.exports = app;