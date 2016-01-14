var express = require('express');
var router = express.Router();
var passport = require('passport');
var request = require('request');
var MovieDB = require('moviedb')('782b6c90018378ce662350a3bc5cdc63');

/* GET users listing. */
router.get('/', function(req, res, next) {
	MovieDB.miscPopularTvs(function(err, searchRes){
		console.log(searchRes);
		topRates = searchRes.results;

  		res.render('index', {topRates:topRates});
	});
});
// Popular page
router.get('/popular',function(req,res){
	MovieDB.miscPopularTvs(function(err, searchRes){

		populars = searchRes.results;
		console.log(populars);
		res.render("tvshows/popular", {populars:populars});
	});
});
// New Release page
router.get('/newRelease',function(req,res){
	MovieDB.miscTopRatedTvs(function(err, searchRes){
		topRates = searchRes.results;
		res.render("tvshows/newRelease" , {topRates:topRates});
	});
});

router.get('/tvAiringToday',function(req,res){
	request.get('http://api.themoviedb.org/3/tv/latest', function(err, response, body){
		var input = JSON.parse(body);
		console.log(input);
		// topRates = searchRes.results;
		// res.render("tvshows/newRelease" , {topRates:topRates});
	});
});

// Search tv show
router.get('/search',function(req,res){

    var tvshowQuery = req.query.tvshow;
    
    res.redirect('/tvshows/search/' + tvshowQuery);
  });

router.get('/search/:searchString', function(req,res){
	var tvshowSearch = req.params.searchString;

	MovieDB.searchTv({query: tvshowSearch },function(err, searchRes){
		tvshowLists = searchRes.results;
		console.log("this is " + tvshowLists[0].id);
  		res.render('tvshows/displayShow', {tvshowLists:tvshowLists});
	});
});

// new 
router.get('/new',function(req,res){
	res.render("tvshows/new");
});

// Create
router.post('/',function(req,res){
	knex('tvshows').insert(req.body).then(function(){
		res.redirect('/tvshows');
	});
});

// Edit
router.get('/:id/edit',function(req,res){
	var id = req.params.id;
	knex('tvshows').where({id:id}).first().then(function(author){
		res.render("tvshows/edit", {author:author});
	});
});

// Update
router.put('/:id',function(req,res){
	var id = req.params.id;
	knex('tvshows').where({id:id}).first().update(req.body).then(function(){
		res.redirect('/tvshows');
	});
});

// Delete
router.delete('/:id',function(req,res){
	var id = req.params.id;
	knex('tvshows').where({id:id}).del().then(function(){
		res.redirect('/tvshows');
	});
});

module.exports = router;













