const router = require('express').Router()
const userModel = require('../model/user')
const bookModel = require('../model/book')
const reviewModel = require('../model/review')


router.post('/:username', async (req, res) => {
    let User = await userModel()
    let userId = req.user._id;
    let name = req.body.name;
    let books = [];

    try {
        let bookshelf = {
            name,
            books
        };
        let user = await User.getById(userId);
        let username = user.props.username;
        if (user == null){
            return res.send({
                msg: "_id not found"
            })
        }
        let result = await User.getBy({
            $and: [
                { _id: userId},
                {'bookshelves.name': name}
            ]
        });
        if(result.length == 0){
            await user.addBookshelf(bookshelf);
            res.redirect(`/bookshelves/${username}`)
        }
        else {
            res.render('bookshelf/new',{error: "Bookshelf already exists.", title: "Error"})
        }
        
    } catch (e) {
        res.send(e.message)
        return
    }
})

router.get('/:username/new', async (req, res) => {
    let User = await userModel()
    let user=null;
    try {
        let users = await User.getBy({ username: req.params.username })
        if (users.length == 0){
            return next(createError(404, 'User Not Found'));
        }
        user = users[0];
        res.render("bookshelf/new",{title: "New bookshelf",
                                    user: req.user,
                                    feed_user: user});
    }catch (e) {
        res.send(e.message)
        return
    }
});

router.get('/:username', async (req, res) => {
    let User = await userModel()
    let userId = req.user._id;
    let user=null;
    try {
        let users = await User.getBy({ username: req.params.username })
        if (users.length == 0){
            return next(createError(404, 'User Not Found'));
        }
        user = users[0];
        let bookshelves = user.bookshelves;
        res.render("bookshelf/bookshelves",{bookshelves, 
                                            user: req.user,
                                            feed_user: user,
                                            isMe: user._id == req.user._id,
                                            title: "Bookshelves"
                                        });
    } catch (e) {
        res.send(e.message)
        return
    }
    
})

router.get('/:username/:bookshelf', async (req, res, next) => {
    let User = await userModel()
    let users = await User.getBy(
        { username: req.params.username },
        {
            projection: { 
                bookshelves: {
                    $elemMatch:  {name: req.params.bookshelf }
                }
            }
        }
    )

    if (users.length == 0) {
        return next(new Error('User not Found'))
    }

    user = users[0]

    console.log(user)
    
    res.render('bookshelf/search', {
        query_str: req.params.bookshelf,
        empty: !user.bookshelves || user.bookshelves[0].books.length == 0,
        books: user.bookshelves[0].books,
    })
})

router.delete('/',async (req,res) => {

    let User = await userModel(); 
    
    let userId = req.user._id;
    try {
        let user = await User.getById(userId);
        if (user == null){
            return res.send({
                msg: "_id not found"
            })
        }
        //DELETING BOOKSHELF WILL NO LONGER DELETE BOOKS AND REVIEWS
        /*let books = [];
        let Book = await bookModel();
        let Review = await reviewModel();
 
        let arr = user.props.bookshelves;
        for (var j = 0; j < arr.length; j++) {
            if(arr[j].name == req.body.bookshelf){
                books = arr[j].books;
            }
        };  
        for (var j = 0; j < books.length; j++) {  
            let book = await Book.getById(books[j]._id);
            let reviewIds = book.props.review;
            for (var k = 0; k < reviewIds.length; k++) {
                let rv = await Review.getById(reviewIds[k]);
                await rv.delete();    
            }
            let bk = await Book.getById(books[j]._id);
            await bk.delete();
        };*/
        
        await user.pull('bookshelves', { name: {$eq: req.body.bookshelf} })
        res.json({ success: true })
    } catch (e) {
        res.send(e.message)
        return
    }
})

  module.exports = router;
