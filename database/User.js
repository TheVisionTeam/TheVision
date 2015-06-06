var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	md5 = require('MD5');

var UserSchema = new Schema({
	username: String,
	password: String,
	requestList: [String],
	friendList: [String],
	online: Boolean,
	socketID: String
});

UserSchema.methods.validPassword = function(password) {
	// return true;
	return (md5(password) === this.password);
};

var User  = mongoose.model('User', UserSchema);

module.exports = User;