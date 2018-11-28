
var express = require('express');
var router = express.Router();

const reviewModel = require('../model/review')

router.get('/reviews', async (req, res, next) => {
    let Reviews = await reviewModel()
    res.send(await Reviews.getAll())
    // res.render('/books/review')
})

router.post('/', async (req, res, next) => {
    let reviewBody = req.body.reviewText;
    let bookId = document.getElementsByClassName("bookTitle").id;
    let Reviews = await reviewModel()
    let bookReview = new Reviews({
      bookId,
      reviewBody
    })
    await bookReview.save()
    res.redirect(`/books/${bookId}`)
})

module.exports = router