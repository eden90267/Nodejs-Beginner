var chalk = require('chalk');
var levelup = require('levelup');
var db = levelup('./db');

var foo = function () {
	console.log( chalk.red('this is foo') );

	db.get('message', function (err, value) {
		if (err) return console.log('Ooops!', err) // some kind of I/O error

		console.log('Get:' + value);		
	});
};

var hello = function() {
	console.log('[hello]');
	db.put('message', '[hello]', function(err) {
		if (err) return console.log('Ooops!', err) // some kind of I/O error

		console.log('saved');
	});
};

exports.foo = foo;
exports.hello = hello;