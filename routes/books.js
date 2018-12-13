const router = require('express').Router()
const bookModel = require('../model/book')
const userModel = require('../model/user')
const reviewModel = require('../model/review')
var multiparty = require('connect-multiparty'),
  multipartyMiddleware = multiparty({ uploadDir: './public/resources/' });
const xss = require('xss');


router.get('/', async (req, res, next) => {
  let Book = await bookModel()
  let BookList = await Book.getAll();
  let ReviewList = await reviewModel();
  // res.send(BookList);

  // For testing the books page with long reviews
  for (var i = 0; i < BookList.length; i++) {
    let book = BookList[i];
    let elmt = book.rating;
    let sum = 0;
    for (var k = 0; k < elmt.length; k++) {
      sum += parseInt(elmt[k], 10);
    }
    let addedBy = false;
    if (book.addedBy == xss(req.user._id)) {
      addedBy = true;
    }
    BookList[i].addedBy = addedBy;
    var avg = sum / elmt.length;
    avg = Math.round(avg * 10) / 10;
    var reviews = book.review;
    BookList[i].rating = avg
    for (var j = 0; j < reviews.length; j++) {
      var reviewId = reviews[j];

      try {
        let reviewObject = await ReviewList.getById(reviewId);
        let reviewBody = reviewObject.props.reviewBody;

        var long_review = reviewBody.slice(0, 500);
        long_review = long_review + " ...";
        BookList[i].review[j] = long_review;
      }
      catch (e) {
        return res.send({
          msg: e
        })
      }
    }
  }

  res.render("books/books", { books: BookList, title: "Books" })


})


router.get('/new', async (req, res, next) => {
  let User = await userModel()
  let userId = xss(req.user._id);
  let name = xss(req.query.bookshelf)

  try {
    let user = await User.getById(userId);
    if (user == null) {
      return res.send({
        msg: "_id not found"
      })
    }
    let bookshelves = [];
    if (xss(req.query.bookshelf)) {
      bookshelves = [xss(req.query.bookshelf)];
    }
    else {
      let arr = user.props.bookshelves;
      for (var j = 0; j < arr.length; j++) {
        bookshelves[j] = arr[j].name;
      };

    }
    res.render("books/new", { bookshelves: bookshelves, title: "New book" });
  } catch (e) {
    return res.send({
      msg: e
    })
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
    let Review = await reviewModel()
    let BookObject = await Book.getById(xss(req.params.id));
    let User = await userModel()
    let userId = xss(req.user._id);

    let user = await User.getById(userId);
    if (user == null) {
      return res.send({
        msg: "_id not found"
      })
    }
    let alreadyRated = false;
    let bookshelves = user.props.bookshelves;
    let arr = BookObject.props.review;
    let reviewArray = [];
    for (var j = 0; j < arr.length; j++) {
      let reviewId = arr[j];
      let ReviewObject = await Review.getById(reviewId);
      ReviewObject = ReviewObject.props
      
      let reviewer = ReviewObject.userProfile.userId;
      if (reviewer == userId) {
        ReviewObject.userProfile.userId = true;
        alreadyRated = true;
      }
      else {
        ReviewObject.userProfile.userId = false;
      }

      let reviewerArr = ReviewObject.likes.userId;
      for (var ij = 0; ij < reviewerArr.length; ij++) {
        if (reviewerArr[ij] == userId) {
          ReviewObject.userProfile.userId = true;
        }
      }

      reviewArray.push(ReviewObject);
    }
    let elmt = BookObject.props.rating;
    var sum = 0;
    for (var i = 0; i < elmt.length; i++) {
      sum += parseInt(elmt[i], 10);
    }
    var avg = sum / elmt.length;
    avg = Math.round(avg * 10) / 10;
    console.log(BookObject.props)
    console.log(BookObject.props.title)
    res.render("books/book", {
      _id: BookObject.props._id,
      bookTitle: BookObject.props.title,
      author: BookObject.props.author,
      review: reviewArray,
      rating: avg,
      image: BookObject.props.image,
      bookshelves: bookshelves,
      alreadyRated: alreadyRated,
      title: "Book: " + BookObject.props.title
    });
  }
  catch (e) {
    res.status(404).json({ msg: e });
  }
});

router.post('/:id', multipartyMiddleware, async (req, res, next) => {
  let User = await userModel()
  let Books = await bookModel()
  let userId = xss(req.user._id);

  try {
    let user = await User.getById(userId);
    if (user == null) {
      return res.send({
        msg: "_id not found"
      })
    }

    if (xss(req.params.id)) {
      let bookId = xss(req.params.id);
      let foundBook = await Books.getById(xss(req.params.id));
      if (foundBook == null) {
        return res.send({
          msg: `Book not found`
        })
      }

      let arr = user.props.bookshelves;
      let bookshelf = xss(req.body.bookshelf);
      let obj = arr.find(o => o.name === bookshelf);
      let books = obj.books;

      for (var k = 0; k < books.length; k++) {
        if (books[k]._id == bookId) {
          return res.send({
            msg: `Book already present in ${obj.name} bookshelf`
          })
        }
      }
      if (bookshelf == "Read" || bookshelf == "Currently Reading" || bookshelf == "Want to Read") {
        for (var j = 0; j < 3; j++) {
          books = arr[j].books;
          for (var k = 0; k < books.length; k++) {
            if (books[k]._id == bookId) {
              return res.send({
                msg: `Book already present in ${arr[j].name} bookshelf`
              })
            }
          }
        };
      }

      let result = await user.addBook(bookshelf, foundBook)
      res.send(result)
    }
  } catch (e) {
    res.status(500).json({ msg: e });
  }
})




router.post('/', multipartyMiddleware, async (req, res, next) => {
  let User = await userModel()
  let userId = xss(req.user._id);

  try {
    let user = await User.getById(userId);
    if (user == null) {
      return res.send({
        msg: "_id not found"
      })
    }

    let image = xss(req.files.image.path);
    console.log(req.body.title)
    let title = xss(req.body.title);
    console.log(title)
    let author = xss(req.body.author);
    //let reviewBody = req.body.review;
    // let rating = req.body["book-rating"];
    if (!xss(req.body.bookshelf)) {
      res.status(500).render("books/books", {
        errors: "User does not have bookshelves yet!",
        hasErrors: true,
        title: "Error"
      });
    }

    let bookshelf = xss(req.body.bookshelf);

    if (xss(req.body.genre)) {
      var tags = xss(req.body.genre);
      if (typeof tags === "string") tags = tags.split();
    } else {
      var tags = [];
    }
    // rating = rating.split();
    let Books = await bookModel()
    //let Reviews = await reviewModel();

    try {
      let book = new Books({
        title,
        author,
        review: [],
        rating: [],
        tags,
        addedBy: userId,
        image: "/" + image
      })
      await book.save()

      let bookId = book.props._id;
      /*
      let likes = "0";
      let bookReview = new Reviews({
        bookId,
        userProfile,
        likes,
        reviewBody
      })
      await bookReview.save()*/

      let savedBook = await Books.getById(bookId);
      /*
      savedBook.props.review.push(bookReview.props._id);
      savedBook.updateAll();*/

      await user.addBook(bookshelf, savedBook)
      res.redirect(`/books/${bookId}`)
    } catch (e) {
      return res.send({
        msg: e
      })
    }
  } catch (e) {
    res.status(500).render("books/books", {
      errors: e,
      hasErrors: true,
      title: "Error"
    });
  }
})

router.delete('/books/:id', async (req, res, next) => {
  let id = xss(req.params.id)

  try {
    let Books = await bookModel()
    let book = await Books.getById(id)
    if (book == null) {
      return res.send({
        msg: 'id not found'
      })
    }
    let result = await book.delete()
    res.send(result)
  } catch (e) {
    return res.send({
      msg: e
    })
  }
})

/*router.put('/books/:id', async (req, res, next) => {
  /**
   * body: { "_id": "6efd0903-4db7-4d4b-912f-346eab19b8f9", "name": "changed" }
   */
/*let data = req.body
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
})*/

router.delete('/', async (req, res) => {

  let User = await userModel();
  let Book = await bookModel();
  let Review = await reviewModel();
  let UserList = await User.getAll();
  let bookId = xss(req.body.book);
  let book = await Book.getById(bookId);
  let reviewIds = book.props.review;
  for (var k = 0; k < reviewIds.length; k++) {
    try {
      let rv = await Review.getById(reviewIds[k]);
      await rv.delete();
    }
    catch (e) {
      return res.send({
        msg: e
      })

    }
  }
  try {
    await book.delete();
  }
  catch (e) {
    return res.send({
      msg: e
    })

  }
  for (var ik = 0; ik < UserList.length; ik++) {
    let u = UserList[ik];
    let userId = u._id;
    //let userId = req.user._id;
    try {
      let user = await User.getById(userId);
      let arr = user.props.bookshelves;
      for (var j = 0; j < arr.length; j++) {
        let books = arr[j].books;
        for (var k = 0; k < books.length; k++) {
          if (books[k]._id == bookId) {
            arr[j].books.splice(k, 1);
          }
        }
      };
      user.props.bookshelves = arr;
      await user.updateAll()


    } catch (e) {
      return res.send({
        msg: e
      })
    }
  }
  res.json({ success: true })
})

module.exports = router;