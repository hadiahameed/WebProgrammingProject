const express=require("express");
const router=express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.get('/', async (req,res) => {
        req.logOut();
        //res.clearCookie('connect.sid');
        res.redirect('/');
    
});
module.exports = router;