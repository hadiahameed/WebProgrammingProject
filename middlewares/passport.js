const passport = require('passport')
const LocalStrategy = require('passport-local')

let users = [{
    username: 'test',
    password: 'test'
}]

let strategy = new LocalStrategy((username, password, done) => {
    for(let user of users) {
        if (user.username == username && user.password == password) {
            return done(null, user)
        }
    }
    return done(null, false)
})

passport.use(strategy)
passport.serializeUser((user, done) => {
    console.log('serializing user')
    done(null, user.username)
})
passport.deserializeUser((username, done) => {
    console.log('deserializing user')
    for(let user of users) {
        if(user.username == username) {
            return done(null, user)
        }
    }
    return done(null, false)
})
module.exports = passport