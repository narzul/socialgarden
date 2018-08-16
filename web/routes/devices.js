var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Schema = require('../models/StreamSchema.js');
var DropCol = require('../models/drop_collections.js');

router.get('/', function(req, res, next) {
	StreamSchema = mongoose.model('devices', Schema);
	StreamSchema.find(function(err, products) {
		if (err) return next(err);
		res.json(products);
	});
});;


router.get('/:DeviceName', function(req, res, next) {
	StreamSchema = mongoose.model(req.params.DeviceName, Schema);
	StreamSchema.find({
		DeviceName: req.params.DeviceName
	}, function(err, obj) {
		if (err) return next(err);
		res.json(obj);
	});
});

//Looking up last item added to the collectiion
router.get('/:DeviceName/:one', function(req, res, next) {
	var DeviceName = req.params.DeviceName;
	var paramTwo = req.params.one;
	if (paramTwo == "one") {

		StreamSchema = mongoose.model(DeviceName, Schema);
		StreamSchema.findOne({
			DeviceName: DeviceName
		}, function(err, obj) {

			if (err) return next(err);
			res.json(obj);
		}).sort({
			field: 'asc',
			_id: -1
		}).limit(1);
	}
	//delete collection by name of 
	if (paramTwo == "delete") {
		mongoose.connection.collections[DeviceName].drop(function(err) {
			console.log('collection dropped');
		});
		StreamSchema.collection.drop();
		res.json('Stream dropped');
	}
	if (DeviceName == "collection" && paramTwo == "list") {
		var coll = [];
		mongoose.connection.db.listCollections().toArray(function(err, names) {
			if (err) {
				console.log(err);
			} else {
				names.forEach(function(e, i, a) {
					coll.push(e.name);
				});
				console.log('list collections' + coll)
				res.json(coll);
			}
		});
	}
});


router.post('/', function(req, res, next) {
	StreamSchema = mongoose.model(req.body.DeviceName, Schema, req.body.DeviceName);
	StreamSchema.create(req.body, function(err, post) {
		if (err) return next(err);
		res.json(post);
	});
});

module.exports = router;