var express = require('express');
var passport = require('passport');
var config = require('./oauth.js');
var FacebookStrategy = require('passport-facebook').Strategy;
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require("method-override");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var knex = require('./db/knex');
require('dotenv').load();


var Users = function () {
  return knex('users');
};

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// config
passport.use(new FacebookStrategy({
  clientID: config.facebook.clientID,
  clientSecret: config.facebook.clientSecret,
  callbackURL: config.facebook.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    process.nextTick(function () {
      Users().where({facebook_id: profile.id}).then(function(user, err) {
        if(err)
          done(err);
        if(user[0]) {
          return done(null, user[0]);
        } else {
          Users().insert({facebook_id: profile.id, name: profile.displayName, email: profile.emails}).then(function() {
            Users().where({facebook_id: profile.id}).then(function(data) {
              return done(null, data[0]);
            });
          });
        }
      });
    });
  }
 ));

var app = express();
var routes = require('./routes/index');
var users = require('./routes/users');
var tvshows = require('./routes/tvshows');
var auth = require('./routes/auth');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser(process.env.SECRET));

app.use(passport.initialize());
app.use(passport.session());// persistent login sessions
// app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static(__dirname + '/public/'));
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