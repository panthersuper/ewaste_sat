
/*
 * routes/index.js
 * 
 * Routes contains the functions (callbacks) associated with request urls.
 */

var request = require('request'); // library to make requests to remote urls
var moment = require("moment"); // date manipulation library


exports.index = function(req, res) {
	console.log('main page requested');
	res.render('index.html');
}

exports.viz = function(req, res) {
	console.log('visualization page requested');
	res.render('viz.html');
}

exports.csv = function(req, res) {
	console.log('csv page requested');
	res.render('readCSV.html');
}

exports.raster = function(req, res) {
	console.log('raster page requested');
	res.render('raster.html');
}

exports.video = function(req, res) {
	console.log('raster page requested');
	res.render('video.html');
}

exports.map = function(req, res) {
	console.log('map page requested');
	res.render('map.html');
}

exports.sheet = function(req, res) {
	console.log('sheet page requested');
	res.render('googlesheet.html');
}