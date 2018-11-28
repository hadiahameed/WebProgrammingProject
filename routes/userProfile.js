const express = require("express");
const router = express.Router();
const cookieMiddleware = require("../middlewares/validateCookie");

router.get("/", async(req,res) => {
    // cookieMiddleware, 
   

    res.render("user/userProfile",{
                        user: req.user,
                        "title"     : "You're viewing user profile page",
                        "firstName" : req.user.firstname,    
                        // "firstName" : userData.firstname,
                            // "lastName"   : userData.lastname
                            });
});

module.exports = router;
