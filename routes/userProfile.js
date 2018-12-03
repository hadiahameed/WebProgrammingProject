const express = require("express");
const router = express.Router();
const userModel = require('../model/user')
const cookieMiddleware = require("../middlewares/validateCookie");

router.get("/", async(req,res) => {
    let User = await userModel();
    let user=null;
    try
    {
        user = await User.getById(req.user._id);
        if (user == null){
            return res.send({
                msg: "_id not found"
            })
        }

    }catch(error)
    {
        res.send(error.message)
        return
    }
    res.render("user/userProfile",{
        user: req.user,
        "user": user.props,
        "title"     : "You're viewing user profile page",
        "firstName" : req.user.firstname,   
    });
});

router.get('/:username', async (req, res) => {
    let User = await userModel();
    let user = await User.getBy({ username: req.params.username});
})

module.exports = router;
