var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
const userModel = require('../model/user')
const passport = require('passport');


    // passport session setup, required for persistent login sessions
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    //Attention: you can also use the same method body as serializeUser. remove user by id is not nesssary.
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    passport.use('local', new LocalStrategy({
        usernameField: 'user-name',
        passwordField: 'user-password'
    }, async function(username, password, done) {
        let user=null;
        try
        {
            let User = await userModel()
            user = await User.getBy({ username });
            console.log(user);
            if(!user)
            {
                console.log("No user")
                return done(null,false, {message : 'Incorrect username'});
            }
            user = user[0]
            if(!user.validated)
            {
                return done(null,false,{message : 'Please validate your account'})
            }
            console.log("No error")
            
        }catch(error)
        {
            console.log("Error found")
            return done(error);
        }

        try
        {
            if(!await bcrypt.compare(password,user.password))
            {
                console.log("Not matched")
                return done(null, false, {message:'Password do not match'});
            }

            return done(null,user);
        }catch(error)
        {
            return done(error);
        }
    }
    ));
module.exports = passport