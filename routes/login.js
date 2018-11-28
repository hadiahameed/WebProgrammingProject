const express = require("express");
const router = express.Router();
const authenticateUser = require("../helpers/verifyAuthenticatedUser");
const passport = require('./passport');
const LocalStrategy = require('passport-local').Strategy;


router.post("/", passport.authenticate('local', ),async(req,res,next) => {
    
    passport.authenticate('local', {failureFlash: true}, function(err, user, info) {
        if (err) {
           return next(err); 
        }
        if (user.length == 0) {
           return res.redirect('/'); 
        }  
        req.logIn(user, function(err) {
          if (err) {
            return next(err); 
          }
          return res.redirect('userProfile');
        });
      })(req, res, next);
      //res.redirect('userProfile');
});

module.exports = router;