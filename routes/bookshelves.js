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
        let bookshelves = user.props.bookshelves;
        bookshelves.push(bookshelf)
        console.log(bookshelves);
        await user.update({bookshelves: bookshelves})
        res.redirect(`/userProfile`)
    } catch (e) {
        res.send(e.message)
        return
    }
})

router.get('/new', async (req, res) => {
    res.render("bookshelf/new");
  })

  module.exports = router;
