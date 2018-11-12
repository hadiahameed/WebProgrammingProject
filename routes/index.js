var express = require('express');
var router = express.Router();

const bookModel = require('../model/book')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("books/book", { title: 'Express' });
});

router.get('/books', async (req, res, next) => {
  let Books = await bookModel()
  let name = req.body.name

  res.send(await Books.getAll())
})

router.post('/books', async (req, res, next) => {
  let Books = await bookModel()
  let name = req.body.name
  let author = req.body.author
  let reviews = req.body.reviews
  try {
    let book = new Books({ name, author, reviews })
    await book.save()
    res.send(book.props)
  } catch (e) {
    res.send(e.message)
    return 
  }
})

module.exports = router;

