const Model = require('./model')

module.exports = async () => {
    let Book = await Model('user', {
        name: String,
    })

    Book.getAllBooks = Book.getAll.bind({
        projection: {
            _id: 1,
            name: 1
        }
    })

    return Book
}
