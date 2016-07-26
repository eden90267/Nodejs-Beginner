var express = require('express');
var router = express.Router();

var levelup = require('levelup');
var db = levelup('./db');

/**
 * GET /1/product
 *
 * Get all products.
 */
router.get('/', function(req, res, next) {
	var products = [];

	db.createReadStream()
		.on('data', function (data) {
			var o = JSON.parse(data.value);
			o['id'] = data.key;
			products.push(o);
		})
		.on('end', function () {
			res.send(products);
		});	
});

/**
 * GET /1/product/:id
 *
 * Get all products.
 */
router.get('/:id', function(req, res, next) {
	db.get(req.params.id, function (err, value) {
        if (err) return console.log('Ooops!', err) // some kind of I/O error
        res.send(value);
	});	
});

/**
 * POST /1/product
 *
 * Add a new product.
 */
router.post('/', function(req, res, next) {
	var object = {
		name: req.body.name,
		type: req.body.type,
		price: req.body.price,
		date: new Date()
	};

	db.put(req.body.id, JSON.stringify(object), function(err) {
        if (err) return console.log('Ooops!', err) // some kind of I/O error
        res.json(object);
	});  
});

/**
 * DELETE /1/product/:id
 *
 * Add a new product.
 */
router.delete('/:id', function(req, res, next) {
	db.del(req.body.id, function(err) {
        if (err) return console.log('Ooops!', err) // some kind of I/O error
        res.json({
        	status: 'ok'
        });
	});  	
});

module.exports = router;
