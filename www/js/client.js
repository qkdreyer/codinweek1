(function(exports) {

	var port = 8200;
	var url = location.origin + ":" + port;
	
	exports.socket = {
		io: null,

		init: function() {
			if (typeof io === "undefined") return;
			
			console.log('Connecting to Server', url);
			
			var socket = io.connect(url);
			exports.socket.io = socket;

			// When current client is connected
			socket.on('connection', function (data) {
				player.userid = data.userid;
				players[data.userid] = player;

				// data.clients = hash of connected players
				var connected_players = data.clients;
				for (var id in connected_players) {
					var coordinates = connected_players[id];
					players[id] = player.add(coordinates);
				}
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

			socket.on('client_moved', function(data) {
				var player_id = data.userid;
				var coordinates = data.userdata;
				
				if (!players[data.userid]) {
					players[data.userid] = player.add(coordinates);
				}
				players[player_id].x = coordinates.x;
				players[player_id].y = coordinates.y;
				
				//console.log('client_moved', player_id, coordinates);
			});
		},

		sync: function(player) {
			// Retrieves current player position

			var x_int = parseInt(player.x, 10);
			var y_int = parseInt(player.y, 10);

			// Compare current to last player position
			if ((player.x_int != x_int || player.y_int != y_int))
			{
				console.log("yes!");
				// If it differs, notify server
				socket.io.emit('client_moved', {x: player.x, y: player.y});
			}

			// Updates last player position
			player.x_int = x_int;
			player.y_int = y_int;			
		}
	};

})(window);