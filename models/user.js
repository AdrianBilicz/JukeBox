var mongoose = require('mongoose')
var bcrypt =  require('bcryptjs')



var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	image: Array,
	tracks: Array
})



UserSchema.statics.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

// UserSchema.methods.getUserByUsername = function(username, callback){
// 	var query = {username: username};
// 	User.findOne(query, callback);
// }

// UserSchema.methods.getUserById = function(id, callback){
// 	User.findById(id, callback);
// }

// UserSchema.methods.comparePassword = function(candidatePassword, hash, callback){
// 	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
//     	if(err) throw err;
//     	callback(null, isMatch);
// 	});
// }

UserSchema.methods.summary = function(){
	var summary = {
		email: this.email,
		username: this.username,
		image: this.image[0] ? this.image[0].url+'=s96-c' :'',
		id: this._id.toString(),
		tracks: this.tracks
	}
	return summary
}
var User = module.exports = mongoose.model('User', UserSchema)


