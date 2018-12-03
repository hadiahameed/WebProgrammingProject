const router = require('express').Router()
const userModel = require('../../model/user')
const authenticate = require('../../middlewares/authenticate')
const uuid = require('uuid/v4')

router.use(authenticate())

router.post('/', async (req, res, next) => {
    let content = req.body.content
    if (!content || !content.trim()) {
        return res.send({
            success: false,
            msg: 'Content cannot be empty'
        })
    }

    let User = await userModel()
    let user = new User( req.user )
    let timestamp =  Date.now()
    let content_uuid = uuid()
    let result = await user.push('timeline', { uuid, content, timestamp })
    await user.broadcast({
        type: 'timeline',
        uid: req.user._id,
        content_uuid,
        content,
        timestamp
    })
    res.send({
        success: true,
        result
    })
})

module.exports = router