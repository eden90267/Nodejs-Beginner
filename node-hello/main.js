
var server = require('./server');

var o = server.start();

o.listen({
	port: 3000,
	path: './'
});