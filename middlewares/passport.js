var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
const userModel = require('../model/user')
const passport = require('passport');
const BaseError = require('../errors').BaseError


// passport session setup, required for persistent login sessions
passport.serializeUser(function (user, done) {
    done(null, user._id);
});

//Attention: you can also use the same method body as serializeUser. remove user by id is not nesssary.
passport.deserializeUser(async function (_id, done) {
    let User = await userModel()
    let user = await User.getById(_id)
    if (user == null) {
        done(new Error('user not foudn'), false)
        return
    }
    done(null, user.props);
});

passport.use('local', new LocalStrategy({
    usernameField: 'user-name',
    passwordField: 'user-password'
}, async function (username, password, done) {
    let user = null;
    let User = await userModel()
    user = await User.getBy({
        username
    });

    if (user.length == 0) {
        // return done(null,false, {message : 'Incorrect username'});
        return done(new BaseError('Incorrect username'), false);
    }
    user = user[0]
    if (!user.validated) {
        // return done(null,false,{message : 'Please validate your account'})
        return done(new BaseError('Please validate your account'), false)
    }

    if (!await bcrypt.compare(password, user.password)) {
        // return done(null, false, {message:'Password do not match'});
        return done(new BaseError('Password do not match'), false);
    }

    return done(null, user);
}));

module.exports = passport