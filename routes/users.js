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
      res.redirect('/signup?error=Invalid Email or Password.');
    }
  });
});

// show user show
// router.get('/',function(req,res){
//   knex('usershows').then(function(usershow){
//     res.render('users/profile',{usershow:usershow});
//   });
// });

/* GET users listing. */
router.get('/profile', function(req, res, next) {
  if(req.signedCookies.userID) {
    var id = req.signedCookies.userID;
    
    knex("users")
    .rightOuterJoin('usershows', 'usershows.user_id','users.id')
    .where({user_id:id}).then(function(usershow){
      
      if(!usershow){
        console.log("IM IN HERE")
        res.redirect('/users/login');
      }
      else{
        console.log("IM IN HERE")
        var myshows = [];
        var myprofile = {};

        // console.log(usershow)

      

        for (var i = 0; i < usershow.length; i++) {
          MovieDB.tvInfo({id: usershow[i].tmdbID}, function(err, searchRes){
            console.log("inside api function", searchRes.name)
            console.log("inside api function", searchRes.id)
            console.log("inside api function", searchRes.poster_path)
            myprofile.name = searchRes.name,
            myprofile.tmdbID = searchRes.id,
            myprofile.poster = searchRes.poster_path
            
            myshows.push(myprofile); 

            console.log(myprofile) 
            console.log(myshows); 

          });                    
        }

        res.render('users/profile',{myshows:myshows});
        // console.log(myshows);
      }

    });
  }
});



router.post('/profile', function(req,res){
  
  var tvshowID = req.body;
  
  if(req.signedCookies.userID) {
    var id = req.signedCookies.userID;
    knex('users').where({id:id}).then(function(usershow){
      if(!usershow){
        res.redirect('/users/login');
      } else {
        knex('usershows').insert({
          user_id:id,
          tmdbID: tvshowID.tmdbID,
          isFavorite: 'true'
        }).then(function(){
          res.redirect('/users/profile');
        //   MovieDB.tvInfo({id: tvshowID.tmdbID}, function(err, searchRes){
        // // console.log(searchRes)
        // var poster = searchRes.poster_path;
        //   res.render('users/profile',{usershow:usershow, poster:poster});
        // });
      });
    
      }
    });
  }
});


// router.get('/:id', function(req, res){
//   if(req.signedCookies.userID === req.params.id) {
//     Users().where('id', req.params.id).first().then(function(user){
//       if(user) {
//         delete user.password;
//         res.json(user);
//       } else {
//         res.status(404);
//         res.json({ message: 'not found' });
//       }
//     }).catch(function(error){
//       res.status(404);
//       res.json({ message: error.message });
//     });
//   } else {
//     res.status(401);
//     res.json({ message: 'not allowed' });
//   }
// });


module.exports = router;
