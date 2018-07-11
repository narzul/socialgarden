var mongoose = require('mongoose');
var Sensor = new mongoose.Schema({
	"Sensor": {
		"Name": String,
		"Value": String
	},
});

module.exports = Sensor;