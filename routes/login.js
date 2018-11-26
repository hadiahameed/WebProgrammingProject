const express = require("express");
const router = express.Router();
const authenticateUser = require("../helpers/verifyAuthenticatedUser");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


router.post("/", async(req,res,next) => {
    req.check('user-name','Please enter valid user name').isEmpty();
    req.check('user-password','Please enter valid password').isEmpty();

    var errors = req.validationErrors();
    if(errors){
        req.session.errors = errors;
    }
    res.redirect('/home');
    
    passport.authenticate('local', {failureFlash: true}, function(err, user, info) {
        if (err) {
           return next(err); 
        }
        if (!user) {
           return res.redirect('/home'); 
        }  
        req.logIn(user, function(err) {
          if (err) {
            return next(err); 
          }
          return res.redirect('/userProfile');
        });
      })(req, res, next);
});

module.exports = router;