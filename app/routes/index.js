/* jshint node: true */
"use strict";

var path = process.cwd();


module.exports = function (app, db) {

	var urlsCollection = db.collection('urls');

	app.route('/')
		.get(function (req, res) {
			
			res.sendFile(path + '/public/index.html');
		});

	app.route('/new/*')
		.get(function (req, res) {

			var url = req.path.substr(5);
			console.log("url:" + url);

			if (! (url.indexOf("http://") === 0 || url.indexOf("https://") === 0)) {
				url = "http://" + url;
			}

			var re = /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

			if (!re.test(url)) {
				res.send("Error: Invalid url");
			} else {

				var urlCount;
				urlsCollection.count(function (err, result) {
					urlCount = result;
					console.log("url count: " + urlCount);	

					var newUrl = {
						original_url: url,
						short_url: req.hostname + "/" + urlCount
					};
					console.log("newURL:" + JSON.stringify(newUrl));

					urlsCollection.insertOne(newUrl, {'_id': false},
						function (err, result) {
							res.send({original_url: newUrl.original_url, short_url: newUrl.short_url});
						});
				});
			}
		});

	app.route('/urls')
		.get(function (req, res) {

			urlsCollection.find({}, {'_id': false}).toArray(function (err, result) {

				res.send(result);
			});

		});

	app.route('/*')
		.get(function (req, res) {
			
			var shortUrl = req.hostname + req.path;
			console.log("shorturl: " + shortUrl);

			urlsCollection.findOne({short_url: shortUrl}, function (err, result) {
				console.log(result);
				if (result !== null) {
					res.redirect(result.original_url);
				} else {
					res.send("Error: No short url found for given input.");
				}
				
			});

		});

};