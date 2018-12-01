const express = require("express");
const router = express.Router();
const authenticateUser = require("../helpers/verifyAuthenticatedUser");
const passport = require('../middlewares/passport');
const LocalStrategy = require('passport-local').Strategy;


router.post("/", passport.authenticate('local', {
        failureFlash: true
    }),
    (req, res, next) => {
        res.send({ success: true })
    }
);

router.delete('/', async (req, res) => {
    req.logOut();
    //res.clearCookie('connect.sid');
    res.redirect('/');
});

module.exports = router;