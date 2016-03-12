/* jshint node: true */
"use strict";

var express = require('express'),
	routes = require('./app/routes/index.js'),
	mongo = require('mongodb').MongoClient;

var app = express();
var port = Number(process.env.PORT || 8080);

var MONGO_URL = "mongodb://heroku_t33rkqlz:9rij8lqup023nfrn9qdliv0hdv@ds011409.mlab.com:11409/heroku_t33rkqlz";
mongo.connect(MONGO_URL, function (err, db) {
	if (err) throw err;

	console.log("MongoDB successfully connected to port " + port);

	app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
	app.use('/public', express.static(process.cwd() + '/public'));

	routes(app, db);

	app.listen(port, function() {
		console.log("Node.js listening on port " + port + "...");
	});
});





