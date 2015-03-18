module.exports = function () {

	var sqlite3 = require('sqlite3').verbose();
	var db = new sqlite3.Database('db');

	db.serialize(function() {

		db.run('CREATE TABLE if not exists todo (completed bool, title TEXT)', function (err) {
			if (err) {
				console.err(err);
			} else {
				console.log('Database created');
			}
		});

	});

	db.close();
};