var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var bcrypt = require('bcrypt');
var MovieDB = require('moviedb')('782b6c90018378ce662350a3bc5cdc63');



var Users = function () {
  return knex('users');
};

router.get('/signup', function (req,res){
  res.render('users/signup');
});

// sign up with form
router.post('/signup', function(req, res, next) {

  Users().where('email', req.body.email).first().then(function(user){
    if(!user) {
      var hash = bcrypt.hashSync(req.body.password, 8);
      Users().insert({
        name: req.body.name,
        email: req.body.email,
        password: hash
      }, 'id').then(function(id) {
        res.cookie('userID', id[0], { signed: true });
        res.redirect('login?userID=' + id[0]);
      });
    } else {
      res.status(409);
      res.redirect('login?error=You have already signed up. Please login.');
    }
  });
});

router.get('/login', function (req,res){
  res.render('users/login');
});

router.post('/login', function(req, res, next){
  
  Users().where({
    email: req.body.email,
  }).first().then(function(user){
    if(user) {
      // bcrypt.compareSync will hash the plain text password and compare
      if(bcrypt.compareSync(req.body.password, user.password)) {
        res.cookie('userID', user.id, { signed: true });
        res.redirect('/users/profile');
      } else {
        res.redirect('/profile?error=Invalid Email or Password.');
      }
    }
     else {
      res.redirect('/users/signup');
    }
  });
});


/* GET users listing. */
router.get('/profile', function(req, res, next) {
    if(req.signedCookies.userID) {
    var id = req.signedCookies.userID;

    knex("users")
    .rightOuterJoin('usershows', 'usershows.user_id','users.id')
    .where({user_id:id}).then(function(usershow){

      if(!usershow){
        res.redirect('/users/login');
      }
      else{
        var myshows = [];
        var counter = 0;
        if(usershow.length > 0){
          for (var i = 0; i < usershow.length; i++) {
            MovieDB.tvInfo({id: usershow[i].tmdbID}, function(err, searchRes){
              var myprofile = {
                name: searchRes.name,
                tmdbID: searchRes.id,
                poster: searchRes.poster_path
              };
              counter++;
              myshows.push(myprofile);
              
              if( counter === usershow.length) {
               res.render('users/profile',{myshows:myshows, usershow:usershow});
              } //--end if 
            }); //--end movie search   
          } //--end for loop
        } else{
          res.render('users/profile',{myshows:myshows, usershow:usershow});
        }
      } //--end else
    }); //--end knex
  }
  else{
    console.log("user id:");
    console.log(req.signedCookies.userID);
  }
});


router.post('/profile', function(req,res){
  
  var tvshowID = req.body;
  
  if(req.signedCookies.userID) {
    var id = req.signedCookies.userID;
    knex('users').where({id:id}).then(function(usershow){
      if(!usershow){
        res.redirect('/users/login');
      } 
      else {
          knex('usershows').insert({
            user_id:id,
            tmdbID: tvshowID.tmdbID,
            isFavorite: 'true',
            hasWatched: 'false'
          }).then(function(){
              res.redirect('/users/profile');
          });  
        }
    });
  } else {
    res.redirect('/users/login');
  }
});

router.get('/logout', function(req, res){
  res.clearCookie('userID');
  res.redirect('/');
});


module.exports = router;
