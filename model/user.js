var mongoose = require('mongoose');
var bcrypt = require('bcrypt')

const Model = require('./model')

module.exports = async () => {
    let User = await Model('user', {
        name: String,
        email: String,
        password: String,
        validated: Boolean,
        validation_code: Number
    });

    User.getAllUsers = User.getAll.bind({
        projection: {
            _id: 1,
            name: 1
        }
    });

    return User
}

module.exports = User;