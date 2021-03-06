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
var parseString = require('xml2js').parseString;

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
        cert:'MIIC1DCCAbygAwIBAgIQdETDRQ+zh4REKWUskwFVMjANBgkqhkiG9w0BAQsFADAmMSQwIgYDVQQDExtBREZTIFNpZ25pbmcgLSBhYXVpYW1hcHAuZGswHhcNMTcwNTIxMTEyODIyWhcNMTgwNTIxMTEyODIyWjAmMSQwIgYDVQQDExtBREZTIFNpZ25pbmcgLSBhYXVpYW1hcHAuZGswggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCguuuREql8EmklOh3OkqF+SwXLecOJ2do4/bN0NG00yfdZi2J4fWYLNQx44MVdHluQDteIZK1mamVRqotJds5ScgfC8JGlbA0JKVYXA0UMZgMUWUhEBRoCIOQ63CJxY8QmJFL+5dL/y4xJCM9UUVZFqNIJuaj8wMQy141a6i4lN5ACEQtOidLJzGaxW7VnwRU49oScGqI2GuZinhS+CRzrXka+wskHPC+UrOhTBMpf/YXgGzgf7lVK9ylrE212G5WuxzDJlwfhiDCOtDnnIvvArF+VlxpSfpbqFVk9DjSyrUYgnNJT7dBv3lAcfPniU1gelrmEOZi5FlnK+9zCWVOHAgMBAAEwDQYJKoZIhvcNAQELBQADggEBADA4i3pSMJer7D/mDCF2xaPkU/J20M/1n4QeYmnGSQjghTn4xxdYnwCRqbSJ3EQJ++nlWQMwrrMDcMzJizJvXEzRQEuxmF+vNdGPU9uB97YvjUzmYCyJTF3PfjjzTaPJxAd7gyYhkd2xASHAq5p0movXO5L5yK91EJFKFbLG2QCyDS620oYDmEy0Z2pISFoInIpdjI0fycfU55rwQid305U1+gQzXp0rwLvbfamBGQ1Z133VjPfZIiy4T9bdGKxW2RHgBlI4/KGi4kJDKxtiuoiP0+qUZJpJRLC/0sqbG5kzzw/vau8Uj0UWufwjR00R+SDHq6eCePvE5yOAXi1FyQs=',
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

router.use(logger("combined"));
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
var prohibited = require('./routes/prohibited');
var res1 = require('./routes/res1');
var res2 = require('./routes/res2');
var res3 = require('./routes/res3');
var res4 = require('./routes/res4');
var res5 = require('./routes/res5');
var res6 = require('./routes/res6');
var res7 = require('./routes/res7');
var res8 = require('./routes/res8');

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

function ensureAuthZres1(req, res, next) {
    var saml = JSON.stringify(req.user, null, 4);
    var json = JSON.parse(saml);
    var subject = json["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"];
    var resource = '/ict/itcom';
    var action = 'create';
    var url = 'https://www.aauiamapp.dk:9443/services/EntitlementService?wsdl';
    var args = {
        subject: subject,
        resource: resource,
        action: action
    };

    console.log("subject: " + subject + "res: " + resource + "action: " + action + " requested for authz");

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    soap.createClient(url, function(err, client) {
        client.setSecurity(new soap.BasicAuthSecurity('admin', 'admin'));
        client.getDecisionByAttributes(args, function(err, result) {
            parseString(result.getDecisionByAttributesResponse.return, function (err, result) {
                var decision = result.Response.Result[0].Decision[0];
                console.log(decision);
                if(decision === "Permit"){
                    console.log("Yesss are are in");
                    return next();
                }
                else{
                    console.log("Noooooo");
                    res.redirect('/prohibited')
                }
            })
        });
    });
}

function ensureAuthZres2(req, res, next) {
    var saml = JSON.stringify(req.user, null, 4);
    var json = JSON.parse(saml);
    var subject = json["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"];
    var resource = '/ict/itcom';
    var action = 'read';
    var url = 'https://www.aauiamapp.dk:9443/services/EntitlementService?wsdl';
    var args = {
        subject: subject,
        resource: resource,
        action: action
    };

    console.log("subject: " + subject + "res: " + resource + "action: " + action + " requested for authz");

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    soap.createClient(url, function(err, client) {
        client.setSecurity(new soap.BasicAuthSecurity('admin', 'admin'));
        client.getDecisionByAttributes(args, function(err, result) {
            parseString(result.getDecisionByAttributesResponse.return, function (err, result) {
                var decision = result.Response.Result[0].Decision[0];
                console.log(decision);
                if(decision === "Permit"){
                    return next();
                }
                else{
                    res.redirect('/prohibited')
                }
            })
        });
    });
}

function ensureAuthZres3(req, res, next) {
    var saml = JSON.stringify(req.user, null, 4);
    var json = JSON.parse(saml);
    var subject = json["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"];
    var resource = '/ict/itcom';
    var action = 'update';
    var url = 'https://www.aauiamapp.dk:9443/services/EntitlementService?wsdl';
    var args = {
        subject: subject,
        resource: resource,
        action: action
    };

    console.log("subject: " + subject + "res: " + resource + "action: " + action + " requested for authz");

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    soap.createClient(url, function(err, client) {
        client.setSecurity(new soap.BasicAuthSecurity('admin', 'admin'));
        client.getDecisionByAttributes(args, function(err, result) {
            parseString(result.getDecisionByAttributesResponse.return, function (err, result) {
                var decision = result.Response.Result[0].Decision[0];
                console.log(decision);
                if(decision === "Permit"){
                    return next();
                }
                else{
                    res.redirect('/prohibited')
                }
            })
        });
    });
}

function ensureAuthZres4(req, res, next) {
    var saml = JSON.stringify(req.user, null, 4);
    var json = JSON.parse(saml);
    var subject = json["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"];
    var resource = '/ict/itcom';
    var action = 'delete';
    var url = 'https://www.aauiamapp.dk:9443/services/EntitlementService?wsdl';
    var args = {
        subject: subject,
        resource: resource,
        action: action
    };

    console.log("subject: " + subject + "res: " + resource + "action: " + action + " requested for authz");

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    soap.createClient(url, function(err, client) {
        client.setSecurity(new soap.BasicAuthSecurity('admin', 'admin'));
        client.getDecisionByAttributes(args, function(err, result) {
            parseString(result.getDecisionByAttributesResponse.return, function (err, result) {
                var decision = result.Response.Result[0].Decision[0];
                console.log(decision);
                if(decision === "Permit"){
                    return next();
                }
                else{
                    res.redirect('/prohibited')
                }
            })
        });
    });
}

function ensureAuthZres5(req, res, next) {
    var saml = JSON.stringify(req.user, null, 4);
    var json = JSON.parse(saml);
    var subject = json["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"];
    var resource = '/ict/icte';
    var action = 'create';
    var url = 'https://www.aauiamapp.dk:9443/services/EntitlementService?wsdl';
    var args = {
        subject: subject,
        resource: resource,
        action: action
    };

    console.log("subject: " + subject + "res: " + resource + "action: " + action + " requested for authz");

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    soap.createClient(url, function(err, client) {
        client.setSecurity(new soap.BasicAuthSecurity('admin', 'admin'));
        client.getDecisionByAttributes(args, function(err, result) {
            parseString(result.getDecisionByAttributesResponse.return, function (err, result) {
                var decision = result.Response.Result[0].Decision[0];
                console.log(decision);
                if(decision === "Permit"){
                    return next();
                }
                else{
                    res.redirect('/prohibited')
                }
            })
        });
    });
}

function ensureAuthZres6(req, res, next) {
    var saml = JSON.stringify(req.user, null, 4);
    var json = JSON.parse(saml);
    var subject = json["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"];
    var resource = '/ict/icte';
    var action = 'read';
    var url = 'https://www.aauiamapp.dk:9443/services/EntitlementService?wsdl';
    var args = {
        subject: subject,
        resource: resource,
        action: action
    };

    console.log("subject: " + subject + "res: " + resource + "action: " + action + " requested for authz");

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    soap.createClient(url, function(err, client) {
        client.setSecurity(new soap.BasicAuthSecurity('admin', 'admin'));
        client.getDecisionByAttributes(args, function(err, result) {
            parseString(result.getDecisionByAttributesResponse.return, function (err, result) {
                var decision = result.Response.Result[0].Decision[0];
                console.log(decision);
                if(decision === "Permit"){
                    return next();
                }
                else{
                    res.redirect('/prohibited')
                }
            })
        });
    });
}

function ensureAuthZres7(req, res, next) {
    var saml = JSON.stringify(req.user, null, 4);
    var json = JSON.parse(saml);
    var subject = json["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"];
    var resource = '/ict/icte';
    var action = 'update';
    var url = 'https://www.aauiamapp.dk:9443/services/EntitlementService?wsdl';
    var args = {
        subject: subject,
        resource: resource,
        action: action
    };

    console.log("subject: " + subject + "res: " + resource + "action: " + action + " requested for authz");

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    soap.createClient(url, function(err, client) {
        client.setSecurity(new soap.BasicAuthSecurity('admin', 'admin'));
        client.getDecisionByAttributes(args, function(err, result) {
            parseString(result.getDecisionByAttributesResponse.return, function (err, result) {
                var decision = result.Response.Result[0].Decision[0];
                console.log(decision);
                if(decision === "Permit"){
                    return next();
                }
                else{
                    res.redirect('/prohibited')
                }
            })
        });
    });
}

function ensureAuthZres8(req, res, next) {
    var saml = JSON.stringify(req.user, null, 4);
    var json = JSON.parse(saml);
    var subject = json["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"];
    var resource = '/ict/icte';
    var action = 'delete';
    var url = 'https://www.aauiamapp.dk:9443/services/EntitlementService?wsdl';
    var args = {
        subject: subject,
        resource: resource,
        action: action
    };

    console.log("subject: " + subject + "res: " + resource + "action: " + action + " requested for authz");

    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    soap.createClient(url, function(err, client) {
        client.setSecurity(new soap.BasicAuthSecurity('admin', 'admin'));
        client.getDecisionByAttributes(args, function(err, result) {
            parseString(result.getDecisionByAttributesResponse.return, function (err, result) {
                var decision = result.Response.Result[0].Decision[0];
                console.log(decision);
                if(decision === "Permit"){
                    return next();
                }
                else{
                    res.redirect('/prohibited')
                }
            })
        });
    });
}


// Mapping all url to file
app.use('/', index);
//app.use('/login', login);
app.use('/prohibited', prohibited);
app.use('/res1', ensureAuthN, ensureAuthZres1, res1);
app.use('/res2', ensureAuthN, ensureAuthZres2, res2);
app.use('/res3', ensureAuthN, ensureAuthZres3, res3);
app.use('/res4', ensureAuthN, ensureAuthZres4, res4);
app.use('/res5', ensureAuthN, ensureAuthZres5, res5);
app.use('/res6', ensureAuthN, ensureAuthZres6, res6);
app.use('/res7', ensureAuthN, ensureAuthZres7, res7);
app.use('/res8', ensureAuthN, ensureAuthZres8, res8);


app.get('/logout', function(req, res){
    console.log('logging out');
    req.logout();
    res.redirect('/');
});


module.exports = app;