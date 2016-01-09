var express = require('express');
var router = express.Router();
var MovieDB = require('moviedb')('782b6c90018378ce662350a3bc5cdc63');

/* GET users listing. */
router.get('/', function(req, res, next) {
	var name;
	MovieDB.miscPopularTvs(function(err, searchRes){
		topRates = searchRes.results;
  		res.render('index', {topRates:topRates});
	});
});

router.get('/new',function(req,res){
	res.render("tvshows/new");
});

router.post('/',function(req,res){
	knex('tvshows').insert(req.body).then(function(){
		res.redirect('/tvshows');
	});
});

router.get('/:id/edit',function(req,res){
	var id = req.params.id;
	knex('tvshows').where({id:id}).first().then(function(author){
		res.render("tvshows/edit", {author:author});
	});
});

router.put('/:id',function(req,res){
	var id = req.params.id;
	knex('tvshows').where({id:id}).first().update(req.body).then(function(){
		res.redirect('/tvshows');
	});
});

router.delete('/:id',function(req,res){
	var id = req.params.id;
	knex('tvshows').where({id:id}).del().then(function(){
		res.redirect('/tvshows');
	});
});

module.exports = router;