(function(exports) {

	var host = "codinweek.zapto.org";
	var port = 8200;
	var url = host + ":" + port;
	
	exports.socket = {
		io: null,

		init: function() {
			if (typeof io === "undefined") return false;
			
			console.log('Connecting to Server', url);
			
			var socket = io.connect(url);

			// When current client is connected
			socket.on('connection', function (data) {
				player.userid = data.userid;
				players[data.userid] = player;

				// data.clients = hash of connected players
				var connected_players = data.clients;
				for (var id in connected_players) {
					var coordinates = connected_players[id];
					players[id] = new Player(coordinates.x, coordinates.y);
				}

				exports.socket.io = socket;
			});

			// When another client is connected
			/*socket.on('client_connected', function (data) {
				console.log('client connected', data);
				//TODO show client connected on map
			});*/

			// When current client id disconnected
			socket.on('client_disconnected', function (data) {
				console.log('client disconnected!', data);
				players[data.userid].kill();
				delete players[data.userid];
			});

			socket.on('client_moved', function(player_data) {
				var player_id = player_data.id;

				if (!players[player_id]) {
					players[player_id] = new Player(player_data.x, player_data.y);
				}
				players[player_id].render(player_data);
				
				console.log('another_player_moved', player_id, player_data);
			});
            return true;
		},

		sync: function(player) {
			var player_data = player.serialize();
			socket.io.emit('client_moved', player_data);
			console.log("player_moved", player.x_int, player.y_int, player_data);
		}
	};

})(window);