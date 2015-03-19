var net = require('net');

function createClients (count, interval) {
	var working = 0;

	count = count || 10000;
	interval = interval || 100;

	while(count--) {
		(function (index) {
			var intervalId, client;

			function createClient() {
				client = new net.Socket();
				
				client.connect(1337, '127.0.0.1', function() {
					client.connected = true;
					working ++;
					
					intervalId = setInterval(function () {
						client.write('Client ' + index);
					}, interval);
					console.log('Client ' + index + ': connected');
				});

				client.on('data', function(data) {
					console.log('Client ' + index+ ': received ' + data);
				});

				client.on('close', function() {
					console.log('Client ' + index+ ': closed');
				});

				client.on('error', function(error) {
					if (client.connected) {
						working--;
					}
					console.log('Client ' + index+ ': error ' + error);
					clearInterval(intervalId);
					client.destroy();
					createClient();
				});

				
			}

			createClient();

		}(count));
	}

	setInterval(function () {
		console.log('Count working clients: ' + working);
	}, interval);
}

module.exports = createClients;

createClients(1000, 1000);