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

	socket.on('client_moved', function (player_data) {
		clients[player_data.id] = player_data;
		socket.broadcast.emit('client_moved', player_data);
	});

	socket.on('disconnect', function () {
		console.log('client disconnected', socket.userid, clients_count);
		delete clients[socket.userid];
		clients_count--;
		io.sockets.emit('client_disconnected', {userid: socket.userid});
	});

	socket.on('playerHit', handle_ennemy_collision);

	socket.on('missileHit', handle_ennemy_hit);
});

io.set('log level', log_level);

var game_loop = 0;
// x:40-400, y: 160
var ennemies_data = [{
	"id": 1,
	"x": 100,
	"y": 180,
	"hp": 100,
	"key": 'baddie'
}, {
	"id": 2,
	"x": 400,
	"y": 180,
	"hp": 200,
	"key": 'dragon'
}];
var other_data = [];

var handle_ennemy_collision = function(collision_data) {
	var ennemy_id = collision_data.ennemy_id;
	var angle = collision_data.angle;
};

var handle_ennemy_hit = function(hit_data) {
	var ennemy_id = hit_data.ennemy_id;
	var damage = hit_data.damage;

	ennemies_data[ennemy_id].hp -= damage;
};

var generate_ennemy_data = function(ennemy_data) {
	if (ennemy_data.dir == 1) {
		ennemy_data.x += 1;
	} else {
		ennemy_data.x -= 1;
	}

	if (ennemy_data.x < 0) {
		ennemy_data.dir = 1;
	} else if (ennemy_data.x > 400) {
		ennemy_data.dir = -1;
	}

	return ennemy_data;
}
	
var generate_server_data = function() {

	for (var e in ennemies_data) {
		var ennemy_data = ennemies_data[e];
		ennemies_data[e] = generate_ennemy_data(ennemy_data);
		console.log(ennemies_data[e].id, ennemies_data[e].x);
	}

	var server_data = {};
	server_data[0] = ennemies_data;
	server_data[1] = other_data;

	io.sockets.emit('server_data', server_data);
}

setInterval(generate_server_data, 50);
