const express = require("express");
const router = express.Router();
const userModel = require('../model/user')
const cookieMiddleware = require("../middlewares/validateCookie");

router.get("/", async(req,res) => {
    // cookieMiddleware,
    let User = await userModel();
    let user = await User.getById(req.user._id);
    
    res.render("user/userProfile",{
                        user: user.props,
                        "title"     : "You're viewing user profile page",
                        "firstName" : req.user.firstname,    
                        // "firstName" : userData.firstname,
                            // "lastName"   : userData.lastname
                            });
});

module.exports = router;
