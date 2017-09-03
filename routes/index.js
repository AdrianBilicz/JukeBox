var express = require('express');
var router = express.Router();
var request = require('request');
var mongoose = require('mongoose');
var async = require('async')
var moment = require('moment')


var User = require('../models/user')

//prevent requesting for favicon
router.get('/favicon.ico', function(req, res) {
	res.status(204);
});

//Uploading youtube video to database
router.post('/upload', function(req, res, next) {
	var upload = req.body.upload
	var file = req.body.file
	var id = req.user._id
	console.log(id)
	User.findOne({ _id: id }, function(err, result) {
		if(upload == 'track'){
			var tracks = req.user.tracks
			tracks.push(file)

			User.update({_id: id},{"$set": {tracks: tracks}},function(err,res){
				if (err) {
					return res.send({ success: false, msg: 'error updataing database' })
				}
				 
			})
			var user = req.user
			return	res.send({user: user})
		}
		if(upload == 'image'){
			var image = []
			image.push(file)
			User.update({_id: id},{"$set": {image: image}},function(err,res){
				if (err) {
					return res.send({ success: false, msg: 'error updataing database' })
				}
			})
			var user = req.user
			return	res.send({user: user})
		}


	}); 
});

/* GET home page. */
router.get('/', function(req, res, next) {

	User.find(null, function(err, users) {
		var results =[]
		users.forEach(function(result,i){
			results.push(result.summary())
			})


		return res.render('index', {result: results});
	}); 

});
router.get('/user/:id', function(req, res, next) {
	var id = req.params.id
	User.find({_id: id}, function(err, users) {
		var results =[]
		users.forEach(function(user,i){
			results.push(user.summary())
			})


		return res.send({result: results});
	}); 

});
// Register
router.get('/admin', function(req, res){
		var user = req.user.summary()
		var tracks = user.tracks
		tracks.forEach(function(track,i){
			user.tracks[i].timestamp = moment(track.timestamp).format('L')
		})

		res.render('admin',{user: user});
	});


function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		
		return next();
	} else {
		res.send({info: false})
	}
}

module.exports = router;
