const express = require("express");
const router = express.Router();
const cookieMiddleware = require("../middlewares/validateCookie");

router.get("/", async(req,res) => {
    // cookieMiddleware, 
    let userData = req.cookies['AuthCookie'];

    res.render("user/profile",{
                        "title"     : "You're viewing user profile page",
                        "firstName" : "Sanne",    
                        // "firstName" : userData.firstname,
                            // "lastName"   : userData.lastname
                            });
});

module.exports = router;