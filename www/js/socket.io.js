var user = {};
var socket = io.connect('http://localhost:8200');

// When current client is connected
socket.on('connection', function (data) {
	console.log('on connection', data);
	player.userid = data.userid;
	players[data.userid] = player;

	// data.clients = hash of connected players
	var connected_players = data.clients;
	for (var id in connected_players) {
		var coordinates = connected_players[id];
		players[id] = create_player(coordinates);
	}
});

// When another client is connected
socket.on('client_connected', function (data) {
	console.log('client connected', data);
	//TODO show client connected on map
});

// When current client id disconnected
socket.on('client_disconnected', function (data) {
	console.log('client disconnected!', data);
	players[data.userid].kill();
	delete players[data.userid];
});

socket.on('client_moved', function(data) {
	if (!players[data.userid]) {
		var coordinates = data.userdata;
		players[data.userid] = create_player(coordinates);
	}
	//players = merge(players, data);
	console.log('client_moved', players);
});
