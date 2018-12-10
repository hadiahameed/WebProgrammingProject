const express = require("express");
const router = express.Router();
const userModel = require('../model/user')
const cookieMiddleware = require("../middlewares/validateCookie");
const authenticate = require("../middlewares/authenticate")

var multiparty = require('connect-multiparty'),
  multipartyMiddleware = multiparty({ uploadDir: '.\public\resources\/' });

router.get("/:username", authenticate(), async(req,res) => {
    let User = await userModel();
    let user=null;
    let current_user =null;
    let followingUser;
    let followingUserArray=[];
    try
    {
        //user = await User.getById(req.user._id);
        let users = await User.getBy({ username: req.params.username })
        if(users.length == 0) {
            return next(createError(404, 'User Not Found'));
        }
        
        user = users[0]
        current_user = new User({ _id: req.user._id })
        followingUser = user.following.slice(-3);
        followingUser.forEach( async (fUser) => {
            let userInfo = await User.getById(fUser);
            if(users.length == 0) {
                return next(createError(404, 'User Not Found'));
            }
            followingUserArray.push(userInfo.props.username);
        })
    }catch(error)
    {
        res.send(error.message)
        return
    }
    res.render("user/userProfile",{
        "title"     : "You're viewing user profile page",
        "firstName" : req.user.firstname,
        title: "Profile",
        user: req.user,
        feed_user: user,
        isMe: user._id == req.user._id,
        followingUserArray 
    });
});

router.get('/:username', authenticate(), async (req, res) => {
    let User = await userModel();
    let user = await User.getBy({ username: req.params.username});
})

router.patch("/:username", authenticate(true), multipartyMiddleware, async(req,res,next) => {
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
