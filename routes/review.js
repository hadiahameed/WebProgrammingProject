
var express = require('express');
var router = express.Router();

const reviewModel = require('../model/review');
const bookModel = require('../model/book');

router.get('/reviews', async (req, res, next) => {
    let Reviews = await reviewModel()
    res.send(await Reviews.getAll())
    // res.render('/books/review')
})

router.post('/', async (req, res, next) => {
    let reviewBody = req.body.reviewText;
    let bookId = req.body.bookId;
    let rating = req.body["book-rating"];
    let userId = req.user._id;
    let userFirstName = req.user.firstname;
    let userLastName = req.user.lastname;
    let userProfile = {
        userId,
        userFirstName,
        userLastName
    }
    let likes = {
        count: "0",
        userId: []
    }
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
})

router.patch("/", async (req,res,next) => {
    let reviewId = req.body.reviewId;
    let Review = await reviewModel() 
    try
    {
        let review = await Review.getById(reviewId);
        let likes = review.props.likes.count;
        likes = parseInt(likes) + 1;
        review.props.likes.count = ""+likes;
        review.props.likes.userId.push(req.user._id);
        review.updateAll();
        res.json({ success: true })
    } catch (e) {
        res.send(e.message)
        return
    }   

});

module.exports = router