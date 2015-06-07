var express = require('express'),
	router = express.Router(),
	go = require('../globalObject'),
	passport = require('passport'),
	MD5 = require('MD5');

router.options('*', function(req, res) {
	res.status(200).end();
	next();
});

router.get('/', function (req, res) {
	res.render('index');
});

router.post("/register", function (req, res) {
	go.database.User.findOne({username: req.body.username}, function (err, doc) {
		if (doc) {
			res.send(false);
		} else {
			var newUser = new go.database.User({
				username: username,
				password: MD5(password),
				requestList: [],
				friendList: [],
				online: false,
				socketID: ""
			});
			newUser.save(function (err) {
				if (err) {
					res.send(false);
				} else {
					res.send(true);
				}
			});
		}
	});
});

router.post('/login', passport.authenticate('local', {
	successRedirect: '/home.html',
	failureRedirect: '/'
}));

router.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

// router.post("/newRoom", function (req, res) {
// 	if (!req.user) {
// 		res.status(401);
// 	} else {
// 		var roomID = new Date().toISOString();
// 		go.roomList[roomID] = {
// 			roomName: req.body.roomName,
// 			roomDesc: req.body.roomDesc,
// 			audience: []
// 		};
// 		res.send(roomID);
// 	}
// });

router.post("/friend/add", function (req, res) {
	if (!req.user) {
		res.status(401);
	} else {
		go.database.User.findOne({username: req.body.username}, function (err, doc) {
			if (err) {
				res.send(false);
			} else {
				var index = doc.requestList.indexOf(req.user.username);
				// he/she add first
				if (index !== -1) {
					// remove from requestList & add to friendList
					doc.requestList.splice(index, 1);
					doc.friendList.push(req.user.username);
					doc.save(function (err, doc) {
						if (err) {
							res.send(false);
						} else {
							// add to our friendList
							go.database.User.findOneAndUpdate({
								username: req.user.username
							}, {
								"$push": { friendList: req.body.username }
							}, function (err) {
								if (err) {
									res.send(false);
								} else {
									// emit friend change to the other
									if (doc.online) {
										go.io.to(doc.socketID).emit("friend change", {
											count: doc.friendList.length,
											friend: doc.friendList
										});
									}
									// emit friend chagne to ourselves
									go.database.User.findOne({username: req.user.username}, function (err, self) {
										if (err) {
											console.log(err);
										} else if (self.online) {
											go.io.to(self.socketID).emit("friend change", {
												count: self.friendList.length,
												friend: self.friendList
											});
										}
									})
									res.send(true);
								}
							});
						}
					});
					
				} else {
				// we add first, add to our requestList
					go.database.User.findOneAndUpdate({
						username: req.user.username
					}, {
						"$push": { requestList: req.body.username }
					}, function (err) {
						if (err) {
							res.send(false);
						} else {
							// emit friend request to the other
							if (doc.online) {
								go.io.to(doc.socketID).emit("friend request", req.user.username);
							}
							res.send(true);
						}
					});
				}
			}
		});
	}
});
router.post("/friend/decline", function (req, res) {
	if (!req.user) {
		res.status(401);
	} else {
		go.database.User.findOne({username: req.body.username}, function (err, doc) {
			if (err) {
				res.send(false);
			} else {
				var index = doc.requestList.indexOf(req.user.username);
				if (index === -1) {
					res.send(false);
				} else {
					// remove ourselves from the other's requestList
					doc.requestList.splice(index, 1);
					doc.save(function (err) {
						if (err) {
							res.send(false);
						} else {
							res.send(true);
						}
					});
				}
			}
		});
	}
});
router.get("/friend/request", function (req, res) {
	if (!req.user) {
		res.status(401);
	} else {
		go.database.User.findOne({username: req.user.username}, function (err, doc) {
			if (err) {
				console.log("user not exist");
			} else {
				res.send({
					size: doc.requestList.length,
					friend: doc.requestList
				});
			}
		});
	}
});
router.get("/friend/all", function (req, res) {
	if (!req.user) {
		res.status(401);
	} else {
		go.database.User.findOne({username: req.user.username}, function (err, doc) {
			if (err) {
				console.log("user not exist");
			} else {
				res.send({
					size: doc.friendList.length,
					friend: doc.friendList
				});
			}
		});
	}
});

router.post("/invite", function (req, res) {
	if (!req.user) {
		res.status(401);
	} else {
		go.database.User.findOne({username: req.body.username}, function (err, doc) {
			if (err || !doc.online) {
				res.send(false);
			} else {
				go.io.to(doc.socketID).emit("invite", {
					username: req.user.username,
					roomID: req.body.roomID
				});
			}
		})
	}
});

module.exports = router;
