const express = require("express");
const router = express.Router();
const authenticateUser = require("../helpers/verifyAuthenticatedUser");
const passport = require('./passport');
const LocalStrategy = require('passport-local').Strategy;


router.post("/", passport.authenticate('local',{ successRedirect: '/userProfile',failureRedirect: '/',failureFlash: true }),
function(err, user, info)  {
    //passport.authenticate('local', {failureFlash: true}, function(err, user, info) {
        if (err) {
           return next(err); 
           //return res.render('pages/index',{message:info.message});
        }
        if (user.length == 0) {
           return res.render('pages/index',{message:info.message}); 
        }  
        req.logIn(user, function(err) {
          if (err) {
            return next(err); 
            //return res.render('pages/index',{message:info.message});
          }
          return res.redirect('userProfile');
        });
      //})(req, res, next);
      //res.redirect('userProfile');
    });

module.exports = router;