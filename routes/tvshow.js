var express = require('express');
var router = express.Router();
var MovieDB = require('moviedb')('782b6c90018378ce662350a3bc5cdc63');
// var theMovieDb = require('./public/javascripts/theMovieDb');

/* GET users listing. */
router.get('/', function(req, res, next) {
	var name;
	MovieDB.miscPopularTvs(function(err, searchRes){
		topRates = searchRes.results;
  		res.render('index', {topRates:topRates});
	});
});

module.exports = router;