const router = require('express').Router()
const bookModel = require('../model/book')
const userModel = require('../model/user')
const reviewModel = require('../model/review')
var multiparty = require('connect-multiparty'),
multipartyMiddleware = multiparty({ uploadDir: './public/resources/' });
const xss = require('xss');

const authenticate = require('../middlewares/authenticate')

router.get('/', authenticate(), async (req, res, next) => {
    let q = xss(req.query.q)
    // if (!q) {
    //     return next(new Error('search content cannot be empty'))
    // }

    let Book = await bookModel()
    let User = await userModel()
    let book_result = await Book.getBy({ $text: { $search: q} })
    let user_result = await User.getBy({ $text: { $search: q} }, { projection: ['username', 'lastname', 'firstname', 'image'] })
    res.render('pages/search', {
        books: book_result,
        users: user_result,
        empty: user_result.length == 0 && book_result == 0,
        query_str: q
    })
});

module.exports = router;