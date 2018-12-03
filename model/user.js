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
        feeds: Array,
        timeline: Array,
        image:String
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

    User.prototype.hasFollowed = async function (uid) {
        let result = await User.getBy({ 
            $and: [
                { _id: this.props._id },
                { following: uid }
            ]
        })

        if (result.length != 0) {
            return true
        }

        return false
    }

    User.prototype.broadcast = async function (message) {
        let followers = this.props.followers
        if (!followers) return true
        let promises = []
        for (let uid of followers) {
            let promise = User.getById(uid).then(follower => {
                follower.push('feeds', message)
                return true
            })
            promises.push(promise)
        }
        await Promise.all(promises)
        return true
    }

    return User;
}