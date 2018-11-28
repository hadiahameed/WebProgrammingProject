const express = require("express");
const router = express.Router();
const cookieMiddleware = require("../middlewares/validateCookie");

router.get("/", async(req,res) => {
    // cookieMiddleware, 
   

    res.render("user/userProfile",{
                        user: req.user,
                        "title"     : "You're viewing user profile page",
<<<<<<< HEAD
                        "firstName" : "Sanne",
                        loggedIn: true    
=======
                        "firstName" : req.user.firstname,    
>>>>>>> 89c24a4e20f3cfc7b830a2d3594e5cf6aaeddf7c
                        // "firstName" : userData.firstname,
                            // "lastName"   : userData.lastname
                            });
});

module.exports = router;
