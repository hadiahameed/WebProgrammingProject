const express=require("express");
const router=express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.get('/', async (req,res) => {
    req.session.destroy(function (err){
        req.logout();
        res.redirect('/');
    });
});
module.exports = router;