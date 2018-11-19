
var express = require('express');
var router = express.Router();

const reviewModel = require('../model/review')

router.get('/reviews', async (req, res, next) => {
    let Reviews = await reviewModel()
    res.send(await Reviews.getAll())
    // res.render('/books/review')
})

module.exports = router