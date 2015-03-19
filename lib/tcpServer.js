var net = require('net');
 
var server = net.createServer(function(socket) {
	socket.pipe(socket);
	socket.on('error', function (error) {
		console.error(error);
	});
});
 

module.exports = server;