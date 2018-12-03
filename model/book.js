const Model = require('./model')

module.exports = async () => {
    let Book = await Model('book', {
        title: String,
        author: String,
        review: Array,
        rating: Array,
        tags: Array,
        image: String
    })

    Book.getAllBooks = () => Book.getAll({
        projection: {
            _id: 1,
            title: 1
        }
    })

    return Book
}
