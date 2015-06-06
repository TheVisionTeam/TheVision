var express = require('express');
var http = require('http').Server(express);
var io = require('socket.io')(http);
var go = require('globalObject');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// socket part
io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('new roomID', function (msg) {
		var roomID = msg.roomID;
		// check if roomID exist & no anchor
		if (go.roomList[roomID] && !go.roomList[roomID].anchorSocket) {
			// add socket: {roomID, userType}
			go.roomList[roomID].anchorSocket = socket.id;
			socketList[socket.id] = {
				userType: "anchor",
				IP: msg.IP,
				roomID: roomID
			};
		}
	});
	socket.on('join roomID', function (msg) {
		var roomID = msg.roomID;
		// check if roomID exist & no anchor
		if (go.roomList[roomID] && go.roomList[roomID].anchorSocket) {
			// add socket: {userType}
			socketList[socket.id] = {
				userType: "audience",
				IP: msg.IP
			};
			// add user to room audience list
			go.roomList[roomID].audience.push(socket.id);

			// emit to anchor
			var newAudience = [];
			for (var i = 0; i < go.roomList[roomID].audience.length; ++i) {
				var socketID = go.roomList[roomID].audience[i];
				newAudience.push(go.socketList[socketID].IP);
			}
			var anchorSocket = go.roomList[roomID].anchorSocket;
			io.to(anchorSocket).emit("audience change", anchorSocket);
		}
	})
	socket.on('disconnect', function(){
		console.log('user disconnected');

		// check user type
		// if anchor: delete room and socket
		if (go.socketList[socket.id].userType === "anchor") {
			go.roomList[socketList[socket.id].roomID] = null;
			go.socketList[socket.id] = null;
		} else {
		// if audience: remove from audience list, and emit to anchor
			var roomID = go.socketList[socket.id].roomID;
			// remove from audience list
			var index = go.roomList[roomID].audience.indexOf(socket.id);
			if (index > -1) {
				go.roomList[roomID].audience.splice(index, 1);
			}
			// remove socket
			go.socketList[socket.id] = null;

			// emit to anchor
			var newAudience = [];
			for (var i = 0; i < go.roomList[roomID].audience.length; ++i) {
				var socketID = go.roomList[roomID].audience[i];
				newAudience.push(go.socketList[socketID].IP);
			}
			var anchorSocket = go.roomList[roomID].anchorSocket;
			io.to(anchorSocket).emit("audience change", anchorSocket);
		}
	});
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
