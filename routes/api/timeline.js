const router = require('express').Router()
const userModel = require('../../model/user')
const authenticate = require('../../middlewares/authenticate')
const uuid = require('uuid/v4')

router.use(authenticate())

router.post('/', async (req, res, next) => {
    let content = req.body.content
    if (!content) {
        return res.send({
            success: false,
            msg: 'Content cannot be empty'
        })
    }

    let User = await userModel()
    let user = new User( req.user )
    let timestamp =  Date.now()
    let content_uuid = uuid()
    let pkg = {
        type: 'timeline',
        uid: req.user._id,
        username: req.user.username,
        content_uuid,
        content,
        timestamp
    }
    await user.push('timeline', { uuid, content, timestamp, type: 'timeline' })
    await user.push('feeds', pkg)
    await user.broadcast(pkg)
    res.send({
        success: true,
    })
})

router.get('/', async (req, res, next) => {
    let User = await userModel()
    let user = await User.getById(req.user._id)
    res.send({
        success: true,
        feeds: user.props.feeds
    })
})

router.get('/:username', async (req, res, next) => {
    let User = await userModel()
    let users = await User.getBy( { username: req.params.username } )
    if (users.length == 0) {
        return res.send({
            success: false,
            msg: 'User Not Found'
        })
    }
    res.send({
        success: true,
        timeline: users[0].timeline
    })
})

module.exports = router