var express = require('express');
var router = express.Router();
var passport = require('passport');
var knex = require('../db/knex');
var bcrypt = require('bcrypt');

var Users = function() {
  return knex('users');
};
// sign up with Facebook
router.get('/facebook',
  passport.authenticate('facebook'),
  function(req, res){

  });

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/signup', function (req,res){
  res.redirect('users/login');
});

// sign up with form
router.post('/signup', function(req, res, next) {
   res.redirect('users/signup');

  // Users().where('email', req.body.email).first().then(function(user){
  //   if(!user) {
  //     var hash = bcrypt.hashSync(req.body.password, 8);
  //     Users().insert({
  //       email: req.body.email,
  //       password: hash
  //     }, 'id').then(function(id) {
  //       res.cookie('userID', id[0], { signed: true });
  //       res.redirect('login');
  //     });
  //   } else {
  //     res.status(409);
  //     res.redirect('/login.html?error=You have already signed up. Please login.');
  //   }
  // });
});
module.exports = router;