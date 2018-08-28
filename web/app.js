var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan_logger = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var routes = require('./routes/routes');

var app = express();

var mongoose = require('mongoose');

//Main app. this file is uing express to route, and mongoose for database.
//routes can be found in /routes/devices.js
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/REALlab', {
		useNewUrlParser: true
	})
	.then(() => console.log('connection succesful'))
	.catch((err) => console.error(err));
app.use(morgan_logger('dev'));
app.use(bodyParser.urlencoded({
	'extended': 'false'
}));
app.use(bodyParser.json());
app.use(methodOverride());

app.use(express.static(path.join(__dirname, 'dist')));
app.use('/devices', routes);

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	// render the error page
	res.status(err.status || 500);
	res.send('error');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});
module.exports = app;