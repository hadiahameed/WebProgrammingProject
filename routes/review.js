
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
    let Reviews = await reviewModel()
    let bookReview = new Reviews({
      bookId,
      reviewBody
    });
    await bookReview.save();
    let Books = await bookModel();
    let savedBook = await Books.getById(bookId);
    savedBook.props.review.push(bookReview.props._id);
    savedBook.updateAll();
    res.redirect(`/books/${bookId}`)
})

module.exports = router