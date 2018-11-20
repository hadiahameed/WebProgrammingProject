const router = require('express').Router()
const bookModel = require('../model/book')
const reviewModel = require('../model/review')
const formidable = require('formidable');

router.get('/', async (req, res, next) => {
  let Book = await bookModel()
  let BookList = await Book.getAll();
  res.send(BookList);

})

router.get('/new', async (req, res, next) => {
  res.render("books/new",{});
})

router.get("/:id", async (req, res) => {
  try {
    let Book = await bookModel()
    let BookObject = await Book.getById(req.params.id);
    res.render("books/book", {
      title: BookObject.props.title,
      author: BookObject.props.author,
      review: BookObject.props.review,
      image: BookObject.props.image
    });
  } 
  catch (e) {
    res.status(404).json({ error: "Book not found" });
  }
});


router.post('/',async (req, res, next) => {
  var form = new formidable.IncomingForm();
  form.parse(req);
  form.on('fileBegin', function (name, file){
      file.path = "/public/resources/" +  file.name;
  });
  form.on('file', function (name, file){
    console.log('Uploaded ' + file.name);
  });
  
  let image = "/public/resources/" + req.files.image.name;
  let Books = await bookModel()
  let Reviews = await reviewModel();
  let title = req.fields.title;
  let author = req.fields.author
  let review = req.fields.review
  
  try {
    let book = new Books({
      title,
      author,
      review, 
      image
    })
    await book.save()
    let bookId = book.props._id;
    let bookReview = new Reviews({
      bookId,
      review
    })
    await bookReview.save()
    res.redirect(`/books/${bookId}`)
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
    if (book == null) {
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
    if (book == null) {
      return res.send({
        msg: '_id not found'
      })
    }
    book.props = data
    let result = await book.updateAll()
    return res.send({
      result
    })
  } catch (e) {
    res.send({
      msg: e.message
    })
  }
})

module.exports = router