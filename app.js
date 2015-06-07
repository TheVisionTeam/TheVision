var express     = require('express'),
	http        = require('http').Server(express),
	io          = require('socket.io')(http),
	go          = require('./globalObject');

var path         = require('path'),
	favicon      = require('serve-favicon'),
	logger       = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser   = require('body-parser');

var expressSession     = require('express-session'),
	passport           = require('passport'),
	LocalStrategy      = require('passport-local').Strategy,
	MD5                = require('MD5');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    //res.header("Content-Type", "application/json;charset=utf-8;");
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(expressSession({secret: 'secret key'}));
app.use(passport.initialize());
app.use(passport.session());

// Allow-Origin


go.database.connect(function(msg) {
	console.log(msg);
}, function(err) { 
	console.log(err);
});

passport.serializeUser(function(user, done) {
	done(null, user.id);
});
passport.deserializeUser(function(id, done) {
	go.database.User.findById(id, function(err, user) {
		done(err, user);
	});
});
passport.use(new LocalStrategy(
	function(username, password, done) {
		go.database.User.findOne({username: username}, function (err, user) {
			if (err) {
				return done(err);
			} else {
				if (!user.validPassword(password)) {
					// console.log('wrong password');
					return done(null, false);
				}
				// console.log('correct password');
				return done(null, user);
			}
			
		});
	}
));

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
		console.log("CREATE ROOM");
		console.log(msg);
		var roomID = msg.roomID;
		// check if roomID exist & no anchor
		if (go.roomList[roomID] && !go.roomList[roomID].anchorSocket) {
			// add socket: {roomID, userType}
			go.roomList[roomID].anchorSocket = socket.id;
			go.socketList[socket.id] = {
				userType: "anchor",
				IP: msg.IP,
				roomID: roomID
			};
		}
		console.dir(go);
	});
	socket.on('join roomID', function (msg) {
		var roomID = msg.roomID;
		// check if roomID exist & no anchor
		if (go.roomList[roomID] && go.roomList[roomID].anchorSocket) {
			// add socket: {userType}
			go.socketList[socket.id] = {
				userType: "audience",
				IP: msg.IP,
				roomID: roomID
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
			
			console.dir(go);
		}
	});
	socket.on('video control', function (msg) {
		var roomID = go.socketList[socket.id].roomID;
		go.roomList[roomID].audience.forEach(function (element) {
			io.to(element).emit("video control", msg);
		});
		io.to(go.roomList[roomID].anchorSocket).emit("video control", msg);
	});
	socket.on('danmaku', function (msg) {
		var roomID = go.socketList[socket.id].roomID;
		go.roomList[roomID].audience.forEach(function (element) {
			io.to(element).emit("danmaku", msg);
		});
		io.to(go.roomList[roomID].anchorSocket).emit("danmaku", msg);
	});
	socket.on('disconnect', function(){
		console.log('user disconnected');

		// check user type
		if (go.socketList[socket.id]) {
			// if anchor: delete room and socket
			if (go.socketList[socket.id].userType === "anchor") {
				go.roomList[go.socketList[socket.id].roomID] = null;
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

			console.dir(go);
		}
	});
});
go.io = io;
http.listen(3001, function() {
	console.log("socket listen at 3001");
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
