var express = require('express');
var app = express();
var server = app.listen(8200);
var io = require('socket.io').listen(server);
var uuid = require('node-uuid');
var util = require('util');

var clients = {};
var clients_count = 0;
var log_level = 1;

io.sockets.on('connection', function (socket) {
	// generate unique userid
	var userid = uuid();
	socket.userid = userid;
	clients_count++;
     
    //assigning client to userid
    socket.emit('connection', {userid: userid, clients: clients});
	console.log('client connected', userid, clients_count);

    //notifying other clients of client connection
    socket.broadcast.emit('client_connected', {userid: userid});

	socket.on('client_moved', function (data) {
		clients[socket.userid] = data;
		socket.broadcast.emit('client_moved', {
			userid: socket.userid,
			userdata: data
		});
	});

	socket.on('disconnect', function () {
		console.log('client disconnected', socket.userid, clients_count);
		delete clients[socket.userid];
		clients_count--;
		io.sockets.emit('client_disconnected', {userid: socket.userid});
	});
});

io.set('log level', log_level);