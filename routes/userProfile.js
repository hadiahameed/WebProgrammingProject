const express = require("express");
const router = express.Router();
const cookieMiddleware = require("../middlewares/validateCookie");

router.get("/", cookieMiddleware, async(req,res) => {
   
    let userData = req.cookies['AuthCookie'];

    res.render("pages/home",{"title"     : "You're viewing user profile page",
                            "firstName" : userData.firstname,
                            "lastName"   : userData.lastname
                            });
});

module.exports = router;
