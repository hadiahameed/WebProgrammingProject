const express=require("express");
const router=express.Router();

router.post("/",(req,res) => {
    /*
    * Clear the cookie while logging out
    * Render the home page with some message
    */
    if(req.cookies.AuthCookie)
        res.clearCookie('AuthCookie');
        res.render("page/index",{error:"You've successfully logged out!"})
        });
    