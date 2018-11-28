const router = require('express').Router()
const bookModel = require('../model/book')
const userModel = require('../model/user')
const reviewModel = require('../model/review')
var multiparty = require('connect-multiparty'),
  multipartyMiddleware = multiparty({ uploadDir: './public/resources/' });


router.get('/', async (req, res, next) => {
  let Book = await bookModel()
  let BookList = await Book.getAll();
  // res.send(BookList);
  res.render("books/books", { books: BookList })
})


router.get('/new', async (req, res, next) => {
  let User = await userModel()
  let userId = req.user._id;

  try {
    let user = await User.getById(userId);
    if (user == null) {
      return res.send({
        msg: "_id not found"
      })
    }
    let bookshelves = user.props.bookshelves;
    res.render("books/new", {bookshelves:bookshelves});
  } catch (e) {
    res.send(e.message)
    return
  }
  
})
/*
router.get('/books', async (req, res, next) => {
  // let Books = await bookModel()
  // res.send(await Books.getAll())

  // just some dummy data
  let books = [{title: "Fred", author: "Anne", image: "https://about.canva.com/wp-content/uploads/sites/3/2015/01/children_bookcover.png", added: "11-7-18"},
{title: "The Happy Lemon", author: "Kurt", image: "https://marketplace.canva.com/MAB___U-clw/1/0/thumbnail_large/canva-yellow-lemon-children-book-cover-MAB___U-clw.jpg", added: "11-7-18"}]

  res.render("books/bookshelf", { title: 'Want to read', books: books });
  // res.send(await Books.getAllBooks())
})
*/
router.get("/:id", async (req, res) => {
  try {
    let Book = await bookModel()
    let BookObject = await Book.getById(req.params.id);
    res.render("books/book", {
      title: BookObject.props.title,
      author: BookObject.props.author,
      review: BookObject.props.review,
      rating: BookObject.props.rating,
      image: BookObject.props.image
    });
  }
  catch (e) {
    res.status(404).json({ error: "Book not found" });
  }
});


router.post('/', multipartyMiddleware, async (req, res, next) => {
  let User = await userModel()
  let userId = req.user._id;

  try {
    let user = await User.getById(userId);
    if (user == null) {
      return res.send({
        msg: "_id not found"
      })
    }

  let image = req.files.image.path;
  let title = req.body.title;
  let author = req.body.author;
  let review = req.body.review;
  let rating = req.body["book-rating"];
  if(!req.body.bookshelf){
    res.send("User does not have bookshelves!")
    return
  }
  let bookshelf = req.body.bookshelf;
  let tags = req.body.genre;
  let Books = await bookModel()
  let Reviews = await reviewModel();

  try {
    let book = new Books({
      title,
      author,
      review,
      rating,
      tags,
      image: "/" + image
    })
    await book.save()
    await user.addBook(bookshelf,book)
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

module.exports = router;