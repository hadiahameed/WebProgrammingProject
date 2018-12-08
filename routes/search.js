const router = require('express').Router()
const bookModel = require('../model/book')
const userModel = require('../model/user')
const reviewModel = require('../model/review')
var multiparty = require('connect-multiparty'),
multipartyMiddleware = multiparty({ uploadDir: './public/resources/' });

router.post('/', async (req, res, next) => {
    console.log(req.body.search)
    let Book = await bookModel()
    let BookList = await Book.getAll();
    const result = await BookList.find( book => book.title === req.body.search );
    console.log(BookList)
    console.log(result)
    // doesn't work, result just returns one book + normal mongodb things don't work on this BookList
    res.render("books/books",{books: result, title: "Books"})
});

module.exports = router;