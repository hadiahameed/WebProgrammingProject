var express = require('express');
var router = express.Router();

const bookModel = require('../model/book')
const reviewModel = require('../model/review')
const userModel = require('../model/user')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("pages/index", { title: 'Log in' });
  // if logged in: "pages.home"
});

router.get('/books', async (req, res, next) => {
  let Books = await bookModel()
  // res.send(await Books.getAll())
  res.render("books/bookshelf", { title: 'bookshelf' });
})

router.get('/reviews', async (req, res, next) => {
  let Reviews = await reviewModel()
  res.send(await Reviews.getAll())
})

router.get("/users/:id", async (req, res) => {
  try {
    let User = await userModel()
    res.send(await User.getById(req.params.id))
  } catch (e) {
    res.status(404).json({ error: "User not found" });
  }
});

router.post('/books/new', async (req, res, next) => {
  let Books = await bookModel()
  let Reviews = await reviewModel();
  let name = req.body.name
  let author = req.body.author
  let review_body = req.body.review
  try {
    let book = new Books({ name, author, review_body })
    await book.save()
    let bookId = book.props._id;
    let review = new Reviews({ bookId, review_body })
    res.send(book.props)
    res.send(review.props)
  } catch (e) {
    res.send(e.message)
    return 
  }
})

router.post('/users', async (req, res, next) => {
  console.log(req.body)
  res.send('user created')
})

module.exports = router;

