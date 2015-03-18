var express = require('express');
var _ = require('lodash');
var router = express.Router();

function openDb() {
	var sqlite3 = require('sqlite3').verbose();
	return new sqlite3.Database('db');
}

router.get('/', function(req, res, next) {
	var db = openDb();

	db.serialize(function() {

		db.all('select rowid, completed, title from todo', function (err, rows) {
			res.send(_.map(rows, function (row) { row.completed = !!row.completed; row.id = row.rowid; return row; }));
		});
	});

	db.close();
});

router.post('/', function (req, res) {
	var db = openDb(),
		task,
		stmt;

	task = req.body;
	db.serialize(function() {
		stmt = db.prepare('insert into todo (title, completed) values (?, ?)');
		stmt.run(task.title, task.completed);
  		stmt.finalize();
		db.all('select last_insert_rowid() as id;', function (err, rows) {
			task.id = rows[0].id;
			res.send(task);
		});
	});

	db.close();
});

router.put('/:id', function (req, res) {
	var db = openDb(),
		task,
		stmt;

	task = req.body;
	db.serialize(function() {
		stmt = db.prepare('update todo set title = ?, completed = ? where rowid = ?');
		stmt.run(task.title, task.completed, req.params.id);
  		stmt.finalize();
  		res.send();
	});

	db.close();
});

router.delete('/', function (req, res) {
	var db = openDb(),
		task,
		stmt;

	task = req.body;
	db.serialize(function() {
		stmt = db.prepare('delete from todo where completed = 1');
		stmt.run();
  		stmt.finalize();
  		res.send();
	});

	db.close();
});

router.delete('/:id', function (req, res) {
	var db = openDb(),
		task,
		stmt;

	task = req.body;
	db.serialize(function() {
		stmt = db.prepare('delete from todo where rowid = ?');
		stmt.run(req.params.id);
  		stmt.finalize();
  		res.send();
	});

	db.close();
});

module.exports = router;