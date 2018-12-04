const express = require("express");
const router = express.Router();
const userModel = require('../model/user')
const cookieMiddleware = require("../middlewares/validateCookie");
var multiparty = require('connect-multiparty'),
  multipartyMiddleware = multiparty({ uploadDir: './public/resources/' });

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

router.patch("/", multipartyMiddleware, async(req,res,next) => {
    let User = await userModel();
    let userUpdateProfilePicture={};
    try
    {
        userId = req.user._id;
        let userImage=req.files.avatar.path;
        userUpdateProfilePicture.image=userImage;
        let user = await User.getById(userId);
        if (user == null){
            return res.send({
                msg: "_id not found"
            })
        }
        let updateCount = await user.update(userUpdateProfilePicture);

        res.json({msg:'Profile Picture is updated successfully'});
    } catch (e) {
        res.send(e.message)
        return
    }

})

module.exports = router;
