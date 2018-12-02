const router = require('express').Router()
const authenticate = require('../../middlewares/authenticate')
const userModel = require('../../model/user')
const BaseError = require('../../errors/BaseError')

router.post('/:username/follower', authenticate(true), async (req, res, next) => {
    let User = await userModel()
    let users = await User.getBy({ username: req.params.username })
    if (users.length == 0) {
        next(new BaseError('User Not Found', 400))
    }
    try {
        let user = new User(await users[0])
        let current_user = new User({_id: req.user._id})
        /**
         * Check if followed
         */
        let result = await User.getBy({ 
            $and: [
                { _id: req.user._id },
                { following: user.props._id }
            ]
        })

        if (result.length != 0) {
            return next(new BaseError('You have followed', 400))
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

module.exports = router