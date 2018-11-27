const Model = require('./model')

module.exports = async () => {
    let User = await Model('user', {
        firstname: String,
        lastname: String,
        username: String,
        email: String,
        password: String,
        bookshelves: Array,
        validated: Boolean,
        validation_code: Number
    });

    User.getAllUsers = User.getAll.bind({
        projection: {
            _id: 1,
            username: 1
        }
    });

    User.prototype.addBookshelf = function (bookshelf) {
        this.props.bookshelves.push(bookshelf);
        return this.updateAll();
    }

    return User;
}