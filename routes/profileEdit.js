var express = require('express');
var router = express.Router();
var userModel = require('../model/user')
var bcrypt = require('bcrypt');



router.get("/:username", async(req,res) => {
    res.render("user/userAccountSetting", {title : "AccountSettings", 
                                           user: req.user,
                                          });
                                        });

router.patch("/:username", async (req,res,next) => {
    let userId;
    let userUpdateData={};
    
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let username = req.body.username;
    let password = req.body.password;

    let User = await userModel()
    try
    {
        userId = req.user._id;
        if(firstname) userUpdateData.firstname = firstname;
        if(lastname)  userUpdateData.lastname = lastname;
        if(username)  userUpdateData.username= username;
        if(password)
        {
         const saltRounds = 16;
         const hashedPassword = await bcrypt.hash(password, saltRounds);
         userUpdateData.password = hashedPassword;
       }
    }catch(e) {
        res.status(500).json({ success: false, msg: e.message })
        return;
    }
    
    try
    {

        let user = await User.getById(userId);
        if (user == null){
            return res.send({
                msg: "_id not found"
            })
        }

        let updateCount = await user.update(userUpdateData);

        res.json({msg:`User data is updated successfully. Please login again if you've updated the username and password.`});
    } catch (e) {
        res.send(e.message)
        return
    }   

});

module.exports = router;