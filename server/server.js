var express = require('express');
var app = express();
var server = app.listen(8200);
var io = require('socket.io').listen(server);
var uuid = require('node-uuid');

io.sockets.on('connection', function (socket) {
	// generate unique userid
	socket.userid = uuid();
     
    //assigning client to userid
    socket.emit('onconnected', {id: socket.userid});

	socket.on('message', function (data) {
		handle_message(socket, data);
	});
});

handle_message = function(socket, data) {
	console.log('client', socket.userid, 'data', data);
};