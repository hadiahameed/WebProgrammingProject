const Model = require('./model')

module.exports = async () => {
    let Book = await Model('book', {
        name: String,
        author: String,
        review: String
    })

    Book.getAllBooks = () => Book.getAll({
        projection: {
            _id: 1,
            name: 1
        }
    })

    return Book
}
