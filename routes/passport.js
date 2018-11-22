var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs')
const userModel = require('../model/user')

module.exports = function(passport) {
    // passport session setup, required for persistent login sessions
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    //Attention: you can also use the same method body as serializeUser. remove user by id is not nesssary.
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    passport.use('local', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, async function(req, username, password, done) {
        let user=null;
        try
        {
            let User = await userModel()
            user = await User.getBy({ username });
            if(!user)
            {
                return done(null,false, {message : 'Incorrect username'});
            }
            if(!user.validated)
            {
                return done(null,false,{message : 'Please validate your account'})
            }
            
        }catch(error)
        {
            return done(error);
        }

        try
        {
            if(!await bcrypt.compare(password,user.password))
            {
                return done(null, false, {message:'Password do not match'});
            }

            return done(null,user);
        }catch(error)
        {
            return done(error);
        }
    }
    ));
}