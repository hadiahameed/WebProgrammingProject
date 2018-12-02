const router = require('express').Router()
const userModel = require('../model/user')

router.post('/', async (req, res) => {
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
        if (user == null){
            return res.send({
                msg: "_id not found"
            })
        }
        await user.addBookshelf(bookshelf)
        res.redirect('/bookshelves')
    } catch (e) {
        res.send(e.message)
        return
    }
})

router.get('/new', async (req, res) => {
    res.render("bookshelf/new");
  })

router.get('/', async (req, res) => {
    let User = await userModel()
    let userId = req.user._id;

    try {
        let user = await User.getById(userId);
        if (user == null){
            return res.send({
                msg: "_id not found"
            })
        }
        let bookshelves = user.props.bookshelves;

        res.render("bookshelf/bookshelves",{bookshelves});
    } catch (e) {
        res.send(e.message)
        return
    }
    
})

  module.exports = router;
