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

    try {
        await Book.collection.createIndex({ title: 'text', author: 'text' })
    }
    catch(e) {
        console.error('Error in creating index for books')
        console.log(e.message)
    }

    return Book
}
