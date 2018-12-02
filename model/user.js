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
        validation_code: Number,
        followers: Array,
        following: Array,
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

    User.prototype.addBook = function (bookshelf,book) {
        let arr = this.props.bookshelves;
        for (var j = 0; j < arr.length; j++) {
            if(arr[j].name == bookshelf){
                let selectedBookshelf = j;
                this.props.bookshelves[selectedBookshelf].books.push(book.props);
                return this.updateAll();
            }
        };  
        return false;   
    }

    return User;
}