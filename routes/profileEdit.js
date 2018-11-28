var express = require('express');
var router = express.Router();
var userModel = require('../model/user')
var bcrypt = require('bcrypt');



router.get("/", async(req,res) => {
    res.render("user/userAccountSetting", {title : "AccountSettings", 
                                          'firstname' :req.user.firstname, 
                                          'lastname' : req.user.lastname,
                                          'username' : req.user.username,
                                          'password' : req.user.password
                                            });
                                        });

router.patch("/", async (req,res,next) => {
    let userId;
    let User = await userModel()
    let userUpdateData={};
    try
    {
        userId = req.user._id;
        console.log(userId);
        
        let firstname = req.body.firstname;
        console.log(firstname);
        let lastname = req.body.lastname;
        console.log(lastname);
        let username = req.body.username;
        let password = req.body.password;
        if(firstname) userUpdateData.firstname = firstname;
        if(lastname) userUpdateData.lastname = lastname;
        if(username) userUpdateData.username= username;
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
        console.log(userId);
        let user = await User.getById(userId);
        if (user == null){
            return res.send({
                msg: "_id not found"
            })
        }
        console.log("Before update")
        let updateCount = await user.update(userUpdateData);
        console.log("After update")
        console.log(updateCount.length);
        res.json({msg:'User data is updated successfully'});
    } catch (e) {
        res.send(e.message)
        return
    }   

});

module.exports = router;