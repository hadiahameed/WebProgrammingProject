const router = require('express').Router()
const bookModel = require('../model/book')
const userModel = require('../model/user')
const reviewModel = require('../model/review')
var multiparty = require('connect-multiparty'),
  multipartyMiddleware = multiparty({ uploadDir: './public/resources/' });


router.get('/', async (req, res, next) => {
  let Book = await bookModel()
  let BookList = await Book.getAll();
  let ReviewList = await reviewModel();
  // res.send(BookList);
  
  // For testing the books page with long reviews
  for(var i = 0; i < BookList.length; i++) {
    let book = BookList[i];
    let elmt = book.rating;
    let sum = 0;
    for( var k = 0; k < elmt.length; k++ ){
      sum += parseInt( elmt[k], 10 );
    }
    var avg = sum/elmt.length;
    avg = Math.round( avg * 10 ) / 10;
    var reviews = book.review;
    BookList[i].rating = avg
    for(var j = 0; j < reviews.length; j++) {
      var reviewId = reviews[j];
      
      try{
        let reviewObject = await ReviewList.getById(reviewId);
        let reviewBody = reviewObject.props.reviewBody;
        var long_review = reviewBody.slice(0, 500);
        long_review = long_review + " ...";
        BookList[i].review[j] = long_review;
      }
      catch (e) {
        res.status(500).render("books/books", {
          errors: e,
          hasErrors: true
        });
      }
    }
  }

  res.render("books/books",{books: BookList})


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
    let Review = await reviewModel()
    let BookObject = await Book.getById(req.params.id);
    let arr = BookObject.props.review;
    let reviewArray = [];
    for (var j = 0; j < arr.length; j++){
      let reviewId = arr[j];
      let ReviewObject = await Review.getById(reviewId);
      reviewArray.push(ReviewObject.props);
    }
    let elmt = BookObject.props.rating;
    var sum = 0;
    for( var i = 0; i < elmt.length; i++ ){
      sum += parseInt( elmt[i], 10 );
    }
    var avg = sum/elmt.length;
    avg = Math.round( avg * 10 ) / 10;
    res.render("books/book", {
      _id: BookObject.props._id,
      title: BookObject.props.title,
      author: BookObject.props.author,
      review: reviewArray,
      rating: avg,
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
  let userFirstName = req.user.firstname;
  let userLastName = req.user.lastname;
  let userProfile = {
    userId,
    userFirstName,
    userLastName
  }

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
  let reviewBody = req.body.review;
  let rating = req.body["book-rating"];
  if(!req.body.bookshelf){
    res.send("User does not have bookshelves!")
    return
  }

  let bookshelf = req.body.bookshelf;

  if (req.body.genre) {
    var tags = req.body.genre;
    if(typeof tags === "string") tags = tags.split();
  } else {
    var tags = [];
  }
  rating = rating.split();
  let Books = await bookModel()
  let Reviews = await reviewModel();

  try {
    let book = new Books({
      title,
      author,
      review: [],
      rating,
      tags,
      image: "/" + image
    })
    await book.save()

    let bookId = book.props._id;
    let likes = "0";
    let bookReview = new Reviews({
      bookId,
      userProfile,
      likes,
      reviewBody
    })
    await bookReview.save()
    
    let savedBook = await Books.getById(bookId);
    savedBook.props.review.push(bookReview.props._id);
    savedBook.updateAll();

    await user.addBook(bookshelf,savedBook)
    res.redirect(`/bookshelves`)
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

router.delete('/',async (req,res) => {

  let User = await userModel(); 
  let Book = await bookModel();
  let Review = await reviewModel();

  let userId = req.user._id;
  try {
      let user = await User.getById(userId);
      if (user == null){
          return res.send({
              msg: "_id not found"
          })
      }
      let bookId = req.body.book
      let arr = user.props.bookshelves;
      console.log(arr)
      for (var j = 0; j < arr.length; j++) {
        let books = arr[j].books;
        console.log(books)
        for (var k = 0; k < books.length; k++) {
          if(books[k]._id == bookId){
            arr[j].books.splice(k, 1);
            console.log("************************************")
            console.log(arr[j].books)
          }
        } 
      };  
      let book = await Book.getById(bookId);
      let reviewIds = book.props.review;
      for (var k = 0; k < reviewIds.length; k++) {
          let rv = await Review.getById(reviewIds[k]);
          await rv.delete();    
      }
      await book.delete();
      user.props.bookshelves = arr;
      await user.updateAll()
      res.json({ success: true })
  } catch (e) {
      res.send(e.message)
      return
  }
})

module.exports = router;