const Model = require('./model')

module.exports = async () => {
    let Review = await Model('review', {
        bookId: String,
        body: String
    })

    Review.getAllReviews = Review.getAll.bind({
        projection: {
            _id: 1,
            body: 1
        }
    })
    
    return Review
}
