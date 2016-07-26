var s = require('./router')
var http = require('http');
var url = require('url');

var start = function() {
	var server = http.createServer(function(req, res) {
		var pathname = url.parse(req.url).pathname;

		if (pathname === '/')
			s.foo();
		else if (pathname === '/hello')
			s.hello();

		res.end();
	});

	return server;
};


exports.start = start;