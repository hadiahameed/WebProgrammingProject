const bcrypt = require("bcrypt");
const userModel = require('../model/user')
const config = require('config')

async function userAuthenticate(username, password) {

    let userExists=null;
    try
    {
        let User = await userModel()
        userExists = await User.getBy({ username});

        if(userExists.length !=0)
        {
            let passwordMatches = await bcrypt.compare(password, userExists.password);
            if(passwordMatches)
                return userExists;
            else
            {
                throw -2;
            }
        }
        else
        {
            throw -1;
        }

    }catch(error)
    {
        if(error === -1)
            throw "The user doesn't exist. Please enter a valid user"
        else
        throw "The Password entered do not match. Please re-enter the correct password"
    }
}

module.exports = {userAuthenticate}
