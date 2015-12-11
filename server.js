var express = require('express'),
	passport = require('passport'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	FacebookStrategy = require('passport-facebook').Strategy,
	secrets = require('./secrets'),
	port = 9001;

var app = express();

app.use(session({
	secret: secrets.session,
	resave: false,
	saveUninitalized: false,
}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

passport.use(new FacebookStrategy({
	clientID: secrets.fb.clientID,
	clientSecret: secrets.fb.clientSecret,
	callbackURL: 'http://localhost:' + port + '/api/auth/facebook/callback'
}, function (accessToken, refreshToken, profile, done) {
	done(null, profile);
}));

app.get('/api/auth/facebook', passport.authenticate('facebook'));

app.get('/api/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/api/profile',
	failureRedirect: '/api/auth/facebook'
}));

app.get('/api/profile', function(req,res) {
	if (!req.isAuthenticated()){
		console.log(req);
		res.status(401).send();
	} else {
		res.status(200).send(req.user);
	}
});




app.listen(port, function(err) {
	console.log("listening on ", port);
});