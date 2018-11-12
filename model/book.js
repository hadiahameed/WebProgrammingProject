const Model = require('./model')

module.exports = async () => {
    let Book = await Model('book', {
        name: String,
        author: String,
        reviews: Array
    })

    Book.getAllBooks = Book.getAll.bind({
        projection: {
            _id: 1,
            name: 1
        }
    })

    return Book
}
