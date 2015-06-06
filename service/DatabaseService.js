var config = require('../config.json'),
	mongoose = require('mongoose');

var db = null;

var DatabaseService = function (dbUrl) {
	this.dbUrl = dbUrl;
	this.User = require('../database/User');
}

var DatabaseConnector = function (dbUrl) {
	if (db === null) {
		db = new DatabaseService(dbUrl);
		db.connect();
	}
	return db;
}

DatabaseService.prototype.connect = function() {
	mongoose.connect(this.dbUrl, function(err) {
		if (err){
			console.log(err.message);
		} else {
			console.log("connect success!");
		}
	});
};

module.exports = DatabaseConnector;
