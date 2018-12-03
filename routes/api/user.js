const router = require('express').Router()
const authenticate = require('../../middlewares/authenticate')
const userModel = require('../../model/user')
const BaseError = require('../../errors/BaseError')

router.post('/:username/follower', authenticate(true), async (req, res, next) => {
    let User = await userModel()
    let users = await User.getBy({ username: req.params.username })
    if (users.length == 0) {
        return next(new BaseError('User Not Found', 400))
    }
    try {
        let user = new User(users[0])
        let current_user = new User({_id: req.user._id})

        /**
         * Check if followed
         */
        let result = await current_user.hasFollowed(user.props._id)
        if (result) {
            return next(new BaseError('You have followed', 200))
        }
        
        result = await Promise.all([
            user.push('followers', req.user._id),
            current_user.push('following', user.props._id)
        ])
        res.json({
            success: true,
            result
        })
    }
    catch(e) {
        next(new BaseError(e.message, 500))
    }
})

router.delete('/:username/follower', authenticate(true), async (req, res, next) => {
    let User = await userModel()
    let users = await User.getBy({ username: req.params.username })
    if (users.length == 0) {
        return next(new BaseError('User Not Found', 400))
    }
    try {
        let user = new User(users[0])
        let current_user = new User({_id: req.user._id})

        /**
         * Check if followed
         */
        let result = await current_user.hasFollowed(user.props._id)
        if (result == false) {
            return next(new BaseError('You are not following', 200))
        }

        /**
         * Add follower and following record
         */
        result = await Promise.all([
            user.pull('followers', req.user._id),
            current_user.pull('following', user.props._id)
        ])

        res.json({
            success: true,
            result
        })
    }
    catch(e) {
        next(new BaseError(e.message, 500))
    }
})

module.exports = router