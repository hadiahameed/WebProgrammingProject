const router = require('express').Router()
const userModel = require('../model/user')
const createError = require('http-errors')
const authenticate = require('../middlewares/authenticate')

router.use(authenticate())

router.get('/:username', async (req, res, next) => {
    let User = await userModel()
    let user = await User.getBy({ username: req.params.username })
    if(user.length == 0) {
        return next(createError(404, 'User Not Found'));
    }
    res.render('newsfeed/newsfeed', {
        user: req.user,
        feed_user: user[0],
        isMe: false
    })
})

module.exports = router