var express = require('express');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require("method-override");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('dotenv').load();

var routes = require('./routes/index');
var users = require('./routes/users');
var tvshows = require('./routes/tvshows');
var auth = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
// ßapp.use(methodOverride('_method'));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public/'));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: process.env['FACEBOOK_APP_ID'],
    clientSecret: process.env['FACEBOOK_APP_SECRET'],
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    enableProof: false
  },
  function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      process.nextTick(function () {
      return done(null, profile);
    });
  }
));

app.use('/', routes);
app.use('/users', users);
app.use('/tvshows', tvshows);
app.use('/auth', auth);


app.get('/',function(req,res){
  res.redirect('/index');
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers



// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



app.listen(3000, function(){
  console.log("Server started on port 3000");
});


module.exports = app;
