var express = require('express');
var app = express();
var server = app.listen(8200);
var io = require('socket.io').listen(server);
var uuid = require('node-uuid');
var util = require('util');

var clients = {};

io.sockets.on('connection', function (socket) {
	// generate unique userid
	var userid = uuid();
	socket.userid = userid;
     
    //assigning client to userid
    socket.emit('connection', {userid: userid});

	console.log('client connected', userid);
    //notifying other clients of client connection
    socket.broadcast.emit('client_connected', {userid: userid});

	socket.on('client_moved', function (data) {
		clients[socket.userid] = data;
		socket.broadcast.emit('client_moved', {
			userid: socket.userid,
			userdata: data
		});
	});

	/*socket.on('client_connected', function (data) {
		console.log('client_connected', data);
		socket.broadcast.emit('')
	})*/

	socket.on('disconnect', function () {
		console.log('client disconnected', socket.userid);
		delete clients[socket.userid];
		io.sockets.emit('client_disconnected', {userid: socket.userid});
	});
});