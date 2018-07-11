var mongoose = require('mongoose');

var StreamSchema = new mongoose.Schema({
	"DeviceName": {
		type: String,
		trim: true,
		required: 'Device needs name'
	},
	"Description": String,
	"Location": {
		"Latitude": String,
		"Longitude": String
	},
	"TimeStamp": String,
	"Sensor": [{
		"Name": String,
		"Value": String
	}],

}, {
	strict: false,
	timestamps: true, // adds createdAt and updatedAt fields automatically
	minimize: false // will make sure all properties exist, even if null
});


module.exports = StreamSchema;