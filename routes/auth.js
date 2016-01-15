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
    // Successful authentication
    console.log(req.body);
    // res.redirect('/users/profile');
  });

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


module.exports = router;