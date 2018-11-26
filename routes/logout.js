const express=require("express");
const router=express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.get('/logout', async (req,res) => {
    req.logOut();
    req.flash('success_msg','You are logged out');
    res.redirect('/home');
});
module.exports = router;