var express = require('express');
var router = express.Router();

var levelup = require('levelup');
var db = levelup('./db');

var EventEmitter = require('events');

/**
 * GET /1/product
 *
 * Get all products.
 */
router.get('/', function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

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
    var workflow = new EventEmitter();

    workflow.on('validate', function () {
    	if (!req.body.name) return workflow.emit('error', 'name empty');
        workflow.emit('create');
    });

    workflow.on('error', function (msg) {
        res.send({
        	errors: msg
		});
    });

    workflow.on('create', function () {
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

    workflow.emit('validate');
});

/**
 * DELETE /1/product/:id
 *
 * Add a new product.
 */
router.delete('/:id', function(req, res, next) {
    var workflow = new EventEmitter();

    workflow.on('validate', function () {
        workflow.emit('delete');
    });

    workflow.on('error', function (msg) {
        res.send({
            errors: msg
        });
    });

    workflow.on('delete', function () {
        db.del(req.params.id, function(err) {
            if (err) return workflow.emit('error', err);

            res.json({
                status: 'ok'
            });
        });
    });

    workflow.emit('validate');
});

module.exports = router;
