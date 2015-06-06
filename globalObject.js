var config = require('./config.json'),
	database = require('./service/DatabaseService')(config.dbUrl);

var go = {
	roomList: {
		/*
		roomID: {
			roomName: "name",
			roomDesc: "desc",
			anchorSocket: "socketID",
			audience: [socketID]
		}
		*/
	},
	socketList: {
		/*
		socketID: {
			userType: "anchor"/"audience",
			IP: "xx.xx.xx.xx"
		}
		*/
	},
	database: database
};

module.exports = go;