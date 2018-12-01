const router = require('express').Router()

const session = require('./session')

router.use('/session', session)

module.exports = router