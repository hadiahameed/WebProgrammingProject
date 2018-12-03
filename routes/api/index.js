const router = require('express').Router()

const session = require('./session')
const user = require('./user')
const timeline = require('./timeline')

router.use('/session', session)
router.use('/user', user)
router.use('/timeline', timeline)

module.exports = router