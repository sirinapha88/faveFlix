  var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var bcrypt = require('bcrypt');


var Users = function () {
  return knex('users');
};


router.get('/login', function (req,res){
  res.render('users/login');
});

router.post('/login', function(req, res, next){
  Users().where({
    email: req.body.email,
  }).first().then(function(user){
    if(user) {
      //bcrypt.compareSync will hash the plain text password and compare
      if(bcrypt.compareSync(req.body.password, user.password)) {
        res.cookie('userID', user.id, { signed: true });
        res.redirect('/login?userID=' + user.id);
      } else {
        res.redirect('/login?error=Invalid Email or Password.');
      }
    } else {
      res.redirect('/signup?error=Invalid Email or Password.');
    }
  });
});


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

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.signedCookies.userID) {
    Users().select().then(function(users){
      for (var i = 0; i < users.length; i++) {
        delete users[i]['password'];
      }
      res.json(users);
    });
  } else {
    res.status(401);
    res.json({ message: 'not allowed' });
  }
});

router.get('/:id', function(req, res){
  if(req.signedCookies.userID === req.params.id) {
    Users().where('id', req.params.id).first().then(function(user){
      if(user) {
        delete user.password;
        res.json(user);
      } else {
        res.status(404);
        res.json({ message: 'not found' });
      }
    }).catch(function(error){
      res.status(404);
      res.json({ message: error.message });
    });
  } else {
    res.status(401);
    res.json({ message: 'not allowed' });
  }
});


module.exports = router;