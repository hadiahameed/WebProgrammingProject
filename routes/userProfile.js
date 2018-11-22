const express = require("express");
const router = express.Router();
const cookieMiddleware = require("../middlewares/validateCookie");

router.get("/", async(req,res) => {
    console.log(req.user)
    console.log(req.session)
    res.send(req.user)
    // cookieMiddleware, 
    // let userData = req.cookies['AuthCookie'];

    // res.render("user/profile",{
    //                     "title"     : "You're viewing user profile page",
    //                     "firstName" : "Sanne",    
    //                     // "firstName" : userData.firstname,
    //                         // "lastName"   : userData.lastname
    //                         });
});

module.exports = router;
