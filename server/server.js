var express = require('express');
var app = express();
var server = app.listen(8200);
var io = require('socket.io').listen(server);
var uuid = require('node-uuid');
var util = require('util');
var _ = require('underscore');

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

	socket.on('missileHit', handle_ennemy_hit);
	socket.on('playerHit', handle_ennemy_collision);
	socket.on('ennemyHit', handle_ennemy_collision);
	socket.on('obstacleHit', handle_ennemy_collision);
});

io.set('log level', log_level);

var game_loop = 0;
var ennemies_data = {}
var other_data = [];

var add_ennemy = function(key, x, y, hp, dir) {
	var ennemy_id = uuid();

	ennemies_data[ennemy_id] = {
		"id": ennemy_id,
		"x": x,
		"y": y,
		"hp": hp,
		"key": key,
        "dir": dir
	}
}

add_ennemy('dragon', 400, 145, 200, 1);
add_ennemy('baddie', 100, 175, 100, 1);

var handle_ennemy_collision = function(collision_data) {
	var ennemy_id = collision_data.ennemy_id;
	var angle = collision_data.angle;
	ennemies_data[ennemy_id].dir *= -1;

	console.log('EVENT handle_ennemy_collision', ennemy_id, angle);
};

var handle_ennemy_hit = function(hit_data) {
	var ennemy_id = hit_data.ennemy_id;
	var damage = hit_data.damage;

	console.log('EVENT handle_ennemy_hit', ennemy_id, damage);
	if (!ennemies_data[ennemy_id]) {
		console.warn('undefined');
		return;
	}

	ennemies_data[ennemy_id].hp -= damage;
};

var update_generate_data = function(ennemy_data) {
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

	if (ennemy_data.hp <= 0) {
		delete ennemies_data[ennemy_data.id];
	}

	return ennemy_data.hp > 0 ? ennemy_data : null;
}
	
var generate_server_data = function() {

	var ennemy_count = 0;
	_.each(ennemies_data, function(ennemy_data, ennemy_id) {
		var new_ennemy_data = update_generate_data(ennemy_data);
		if (new_ennemy_data) {
			ennemies_data[ennemy_id] = new_ennemy_data;
			ennemy_count++;
		}
	});

	if (ennemy_count < 3) {
		var x_rnd = parseInt(100 * Math.random(), 10);
		add_ennemy('baddie', x_rnd, 175, 100);
	}

	var server_data = {};
	server_data[0] = ennemies_data;
	server_data[1] = other_data;

	io.sockets.emit('server_data', server_data);
}

setInterval(generate_server_data, 50);
