const express=require("express");
const router=express.Router();

router.post("/",(req,res) => {
    if(req.cookies.AuthCookie)
        res.clearCookie('AuthCookie');
        res.render("page/index",{error:"You've successfully logged out!"})
        });
    