const router = require('express').Router()
const userModel = require('../model/user')
const createError = require('http-errors')
const authenticate = require('../middlewares/authenticate')

router.use(authenticate())

router.get('/:username', async (req, res, next) => {
    let User = await userModel()
    let users = await User.getBy({ username: req.params.username })

    if(users.length == 0) {
        return next(createError(404, 'User Not Found'));
    }

    let user = users[0]
    let current_user = new User({ _id: req.user._id })
    let followed = await current_user.hasFollowed(user._id)
    
    res.render('newsfeed/newsfeed', {
        user: req.user,
        feed_user: user,
        isMe: user._id == req.user._id,
        followed
    })
})

module.exports = router