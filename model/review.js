const Model = require('./model')

module.exports = async () => {
    let Review = await Model('review', {
        bookId: String,
        review: String
    })

    Review.getAllReviews = Review.getAll.bind({
        projection: {
            _id: 1,
            bookId: 1,
            review: 1
        }
    })

    return Review
}
