var express = require('express');
var router = express.Router();

const bookModel = require('../model/book')
const reviewModel = require('../model/review')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("pages/index", { title: 'Log in' });
  // if logged in: "pages.home"
});

router.get('/books', async (req, res, next) => {
  let Books = await bookModel()
  let name = req.body.name

  res.send(await Books.getAll())
})

router.post('/books', async (req, res, next) => {
  let Books = await bookModel()
  let Reviews = await reviewModel();
  let name = req.body.name
  let author = req.body.author
  let reviews = req.body.review
  try {
    let book = new Books({ name, author, review })
    await book.save()
    let bookId = book.props._id;
    let review = new Reviews({ bookId, review })
    res.send(book.props)
  } catch (e) {
    res.send(e.message)
    return 
  }
})

module.exports = router;

