const Model = require('./model')

module.exports = async () => {
    let User = await Model('user', {
        name: String,
        password: String
    })

    User.getAllUsers = User.getAll.bind({
        projection: {
            _id: 1,
            name: 1
        }
    })

    return User
}
