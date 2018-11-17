var mongoose = require('mongoose');
var bcrypt = require('bcrypt')

//const Model = require('./model')

/*module.exports = async () => {
    let User = await Model('user', {
        name: String,
        email: String,
        password: String,
        validated: Boolean,
        validation_code: Number
    })

    User.getAllUsers = User.getAll.bind({
        projection: {
            _id: 1,
            name: 1
        }
    })

    return User
}*/

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        require: true
    },
    validated: {
        type: Boolean
    },
    validation_code: {
        type: Number
    }
});

    UserSchema.statics.authenticate = function (email,password,callback) {
        UserSchema.findOne({ email:email })
            .exec(function (err,user) {
                if (err) {
                    return callback(err)
                } else if (!user) {
                    var err = new Error('User not found.');
                    err.status = 401;
                    return callback(err);
                }
                bcrypt.compare(password, user.password, function (err, result) {
                    if (result === true) {
                        return callback(null, user);

                    }else {
                        return callback();
                    }
                })
            });
    }

UserSchema.pre('save',function (next){
    var user = this;
    bcrypt.hash(user.password,10,function(err,hash){
        if (err){
            return next(err);
        }
        user.password = hash;
        next();
    })
});

var User = mongoose.model('User', UserSchema);
module.exports = User;