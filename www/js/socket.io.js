var user = {};
var socket = io.connect('http://localhost:8200');

// When current client is connected
socket.on('connection', function (data) {
	console.log('on connection');
	player.userid = data.userid;
	players[data.userid] = {};
});

// When another client is connected
socket.on('client_connected', function (data) {
	console.log('client connected', data);
	//TODO show client connected on map
});

// When current client id disconnected
socket.on('client_disconnected', function (data) {
	console.log('client disconnected!', data);
	delete players[data.userid];
	//TODO hide client disconnected on map
});

socket.on('client_moved', function(data) {
	if (!players[data.userid]) {
		players[data.userid] = create_player(data.x, data.y);
	}
	players = merge(players, data);
	console.log('client_moved', players);
});
