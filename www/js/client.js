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
			exports.socket.io = socket;

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
					players[data.userid] = new Player(coordinates.x, coordinates.y);
				}
				players[player_id].render(coordinates);
				
				console.log('anoter_player_moved', player_id, coordinates);
			});
            return true;
		},

		sync: function(player) {
			// Retrieves current player position

			var x_int = parseInt(player.x, 10);
			var y_int = parseInt(player.y, 10);

			// Compare current to last player position
			if ((player.x_int != x_int || player.y_int != y_int))
			{
				// If it differs, notify server
				socket.io.emit('client_moved', {x: player.x, y: player.y});
				console.log("player_moved", player.x, player.y);
			}

			// Updates last player position
			player.x_int = x_int;
			player.y_int = y_int;			
		}
	};

})(window);