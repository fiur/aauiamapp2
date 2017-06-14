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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Express and Passport Session
//var session = require('express-session');
//app.use(session({secret: "A secret"}));
//app.use(passport.initialize());
//app.use(passport.session());



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
        cert: 'MIIE/DCCA+SgAwIBAgISAzN/5izITRMmPTASdjPWDZHYMA0GCSqGSIb3DQEBCwUAMEoxCzAJBgNVBAYTAlVTMRYwFAYDVQQKEw1MZXQncyBFbmNyeXB0MSMwIQYDVQQDExpMZXQncyBFbmNyeXB0IEF1dGhvcml0eSBYMzAeFw0xNzA1MjEwOTQzMDBaFw0xNzA4MTkwOTQzMDBaMBcxFTATBgNVBAMTDGFhdWlhbWFwcC5kazCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALh8R9K2lE5hSbmzhFdoXkmSOaGMOa9zn8PML3+AcrpbwZnb/FijT/QXip/1YiYEyESJjhyizGUxmJ2wkgUL7g/W27FXHRlBM5n6gRbgodyKfbx7jlviwW27JmRpDZFNL6jRi78MtKFjFhrWArcudVLGMLHqHWjq+vdnrElPvijWJIsY8QGbtaXGCGdVpZ4a87Q+hAZUcLNSkwMM/xt6upcUxL7dCGmHUbPYSnvED2AF1qZkWJI7k329c5g9VuCRA3VG+ZAMLOMgXGZF84BTwgMtolm/oFXOpC3xLP4PD8YL0wCI1jDK8I1No4qPWOZPIUsjuhDGNOgaETR6T01j230CAwEAAaOCAg0wggIJMA4GA1UdDwEB/wQEAwIFoDAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwDAYDVR0TAQH/BAIwADAdBgNVHQ4EFgQUabjdMD+g/MmmWlmAjkzN6X5XGaYwHwYDVR0jBBgwFoAUqEpqYwR93brm0Tm3pkVl7/Oo7KEwcAYIKwYBBQUHAQEEZDBiMC8GCCsGAQUFBzABhiNodHRwOi8vb2NzcC5pbnQteDMubGV0c2VuY3J5cHQub3JnLzAvBggrBgEFBQcwAoYjaHR0cDovL2NlcnQuaW50LXgzLmxldHNlbmNyeXB0Lm9yZy8wFwYDVR0RBBAwDoIMYWF1aWFtYXBwLmRrMIH+BgNVHSAEgfYwgfMwCAYGZ4EMAQIBMIHmBgsrBgEEAYLfEwEBATCB1jAmBggrBgEFBQcCARYaaHR0cDovL2Nwcy5sZXRzZW5jcnlwdC5vcmcwgasGCCsGAQUFBwICMIGeDIGbVGhpcyBDZXJ0aWZpY2F0ZSBtYXkgb25seSBiZSByZWxpZWQgdXBvbiBieSBSZWx5aW5nIFBhcnRpZXMgYW5kIG9ubHkgaW4gYWNjb3JkYW5jZSB3aXRoIHRoZSBDZXJ0aWZpY2F0ZSBQb2xpY3kgZm91bmQgYXQgaHR0cHM6Ly9sZXRzZW5jcnlwdC5vcmcvcmVwb3NpdG9yeS8wDQYJKoZIhvcNAQELBQADggEBAEbSwc41C8YXJAUtq0oqLdg5UiUfFqJ8ZiKK91iKOJ+83TWYCFOWnor0K1VucFTcXwn/LlYny7BRkvAVinEfN6AcCi0mfqEsGMx7sE29BNuqOIJ+JvINpyJf7HZhdrPnl5mqvZE41f6mo6o9K98p0VMf9S6lMnHdSWXBS/lMYE0kq+bulUzPFL3S72u8alzUaQkOkCOHKQpJlyBobezs60HQPeXkWd4yvrzft35BbN6hdswPAj7sDLzPrPqK61Vo16inlrvkncjBfeE+WY6LrlKSMReuDoPkw4uyUi9972kT7ga5O3/mEea5rXqOFZKdVrC48ue4HwD1exsnhTF+nqE=',
        disableRequestedAuthnContext: true,
        //authnContext: 'http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/windows',
        identifierFormat: null
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
        res.redirect('/profile');
    }
);


// Define routes
var index = require('./routes/index');
//var login = require('./routes/login');
var users = require('./routes/users');
var register = require('./routes/register');
var profile = require('./routes/profile');
var prohibited = require('./routes/prohibited');
var res1 = require('./routes/res1');
var res2 = require('./routes/res2');
var res3 = require('./routes/res3');

// Simple middleware to ensure user is authenticated.
// Use this middleware on any resource that needs to be protected.
// If the request is authenticated (typically via a persistent login session),
// the request will proceed.  Otherwise, the user will be redirected to the
// login page.



function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        // req.user is available for use here
        return next(); }

    // denied. redirect to login
    res.redirect('/login')
}

// Mapping all url to file
app.use('/', index);
//app.use('/login', login);
app.use('/users', ensureAuthenticated, users);
app.use('/register', ensureAuthenticated, register);
app.use('/profile', ensureAuthenticated , profile);
app.use('/res1', ensureAuthenticated, res1);
app.use('/res2', ensureAuthenticated, res2);
app.use('/res3', ensureAuthenticated, res3);


app.get('/logout', function(req, res){
    console.log('logging out');
    req.logout();
    res.redirect('/');
});


module.exports = app;