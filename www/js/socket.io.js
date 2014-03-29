var user = {};
var socket = io.connect('http://localhost:8200');
socket.on('onconnected', function (data) {
	user.userid = data.id
	socket.emit('message', { text: 'hello server' });
});