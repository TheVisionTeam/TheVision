var express = require('express');
var router = express.Router();
var go = require('globalObjecct');

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Express' });
});

router.post("/newRoom", function(req, res) {
	var roomID = new Date() + "";
	go.roomList[roomID] = {
		roomName: req.body.roomName,
		roomDesc: req.body.roomDesc,
		audience: []
	};
	res.send(roomID);
});

module.exports = router;
