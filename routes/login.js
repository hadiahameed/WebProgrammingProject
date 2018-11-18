const express = require("express");
const router = express.Router();
const authenticateUser = require("../helpers/verifyAuthenticatedUser");


router.post("/", async(req,res) => {
    let userName = req.body.username;
    let password = req.body.password;

    try
    {
        if(!userName)
            throw "Please enter the user name"
        if(!password)
            throw "Please enter the password"
    }catch(error)
    {
        res.status(403);
        res.render("pages/error", {
         error:error
        });
        return;
    }
    
    let isAuthenticatedUser=null;
    let userObject={};
    try
    {
        isAuthenticatedUser = await authenticateUser.userAuthenticate(userName, password);
        if(isAuthenticatedUser)
        {
            userObject['firstName'] = isAuthenticatedUser.firstname;
            userObject['lastName'] =  isAuthenticatedUser.lastname;
        }
    }catch(error)
    {
        res.status(403);
        res.render("page/index",{error:error});
        return;
    }

    res.cookie('AuthCookie',userObject);
    res.redirect('/userProfile');


});

module.exports = router;