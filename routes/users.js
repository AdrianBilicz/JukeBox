var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt =  require('bcryptjs')


var User = require('../models/user');



// Login
router.get('/login', function(req, res){

	return res.render('login');

});



router.post('/register', function(req, res){

	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);


	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

passport.use(new LocalStrategy(
	function(username, password, done) {
		var query = {username: username};
		User.findOne(query, function(err, user){

			if(err) throw err;
			if(!user){
				return done(null, false, {message: 'Unknown User'});
			}




			bcrypt.compare(password, user.password, function(err, isMatch){
				if(err) throw err;
				if(isMatch){
					return done(null, user);
				} else {
					return done(null, false, {message: 'Invalid password'});
				}
			});
		});
	}));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id,function(err, user) {
		done(err, user);
	});
});

router.post('/login',passport.authenticate('local', {successRedirect:'/admin', failureRedirect:'/users/login',failureFlash: true}),
	function(req, res) {
		res.redirect('/admin');
	});

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/admin');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		
		return next();
	} else {
		res.send({info: false})
	}
}

module.exports = router;