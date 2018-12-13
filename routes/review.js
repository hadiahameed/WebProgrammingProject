var express = require('express');
var router = express.Router();

const reviewModel = require('../model/review');
const bookModel = require('../model/book');
const xss = require('xss');

/*router.get('/reviews', async (req, res, next) => {
    let Reviews = await reviewModel()
    res.send(await Reviews.getAll())
})*/

router.post('/', async (req, res, next) => {
    let reviewBody = xss(req.body.reviewText);
    let bookId = xss(req.body.bookId);
    let rating = xss(req.body["book-rating"]);
    let userId = xss(req.user._id);
    let userFirstName = xss(req.user.firstname);
    let userLastName = xss(req.user.lastname);
    let userUsername = xss(req.user.username);
    let userProfile = {
        userId,
        userFirstName,
        userLastName,
        userUsername
    }
    let likes = {
        count: "0",
        userId: []
    }
    try {
        let Reviews = await reviewModel()
        let bookReview = new Reviews({
            bookId,
            userProfile,
            likes,
            reviewBody
        });
        await bookReview.save();
        let Books = await bookModel();
        let savedBook = await Books.getById(bookId);
        savedBook.props.review.push(bookReview.props._id);
        savedBook.props.rating.push(rating);
        savedBook.updateAll();
        res.redirect(`/books/${bookId}`)
    }
    catch (e) {
        return res.send({
            msg: e
        })
    }
})

router.patch("/", async (req, res, next) => {
    let reviewId = xss(req.body.reviewId);

    try {
        let Review = await reviewModel()
        let review = await Review.getById(reviewId);
        let likes = review.props.likes.count;
        likes = parseInt(likes) + 1;
        review.props.likes.count = "" + likes;
        review.props.likes.userId.push(xss(req.user._id));
        review.updateAll();
        res.json({ success: true })
    } catch (e) {
        return res.send({
            msg: e
        })
    }

});

module.exports = router