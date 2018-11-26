const express = require("express");
const router = express.Router();
const authenticateUser = require("../helpers/verifyAuthenticatedUser");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


router.post("/", async(req,res,next) => {
    let userName = req.body["user-name"];
    let password = req.body["user-password"];
    console.log(userName);
    console.log(password);

    try
    {
        if(!userName)
            throw "Please enter the user name"
        if(!password)
            throw "Please enter the password"
    }catch(error)
    {
        res.status(403);
        res.render("pages/error", {
         error:error
        });
        return;
    }
    
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