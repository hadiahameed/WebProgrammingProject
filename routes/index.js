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
  let name = req.body.name
  res.send(await Books.getAllBooks())
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

router.post('/books', async (req, res, next) => {
  /**
   * body: { "_id": "6efd0903-4db7-4d4b-912f-346eab19b8f9", "name": "new" }
   */
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

router.delete('/books/:id', async (req, res, next) => {
  let id = req.params.id
  let Books = await bookModel()
  try {
    let book = await Books.getById(id)
    if(book == null) {
      return res.send({
        msg: 'id not found'
      })
    }
    let result = await book.delete()
    res.send(result)
  } catch (e) {
    res.send(e.message)
  }
})

router.put('/books/:id', async (req, res, next) => {
  /**
   * body: { "_id": "6efd0903-4db7-4d4b-912f-346eab19b8f9", "name": "changed" }
   */
  let data = req.body
  let Books = await bookModel()
  let _id = req.params.id
  try {
    let book = await Books.getById(_id)
    if(book == null) {
      return res.send({ msg: '_id not found' })
    }
    book.props = data
    let result = await book.updateAll()
    return res.send({ result })
  }
  catch (e) {
    res.send({ msg: e.message })
  }
})

router.post('/users', async (req, res, next) => {
  console.log(req.body)
  res.send('user created')
})

module.exports = router;

