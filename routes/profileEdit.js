var express = require('express');
var router = express.Router();
var userModel = require('../model/user')
var bcrypt = require('bcrypt');
const xss = require('xss');



router.get("/:username", async(req,res) => {
    res.render("user/userAccountSetting", {title : "AccountSettings", 
                                           user:    req.user,
                                          });
                                        });

router.patch("/:username", async (req,res,next) => {
    let userId;
    let userUpdateData={};
    
    let firstname = xss(req.body.firstname);
    let lastname = xss(req.body.lastname);
    let username = xss(req.body.username);
    let password = xss(req.body.password);

    let User = await userModel()
    try
    {
        userId = xss(req.user._id);
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

        res.json({msg:`User data is updated successfully. Please login again if you've updated the password.`});
    } catch (e) {
        res.send(e.message)
        return
    }   

});

module.exports = router;