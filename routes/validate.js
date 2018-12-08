const router = require('express').Router()
const userModel = require('../model/user')

router.get('/', async (req, res, next) => {
    let code = req.query.code
    let email = req.query.email
    if (!code || !email) {
        return res.status(400).render('pages/error', {
            message: "Missing paramter code or email",
            title: "Error"
        })
    }

    let User = await userModel()
    let user = await User.getBy({
        validation_code: parseInt(code),
        email: email
    })

    if (user.length == 0) {
        return res.status(400).render('pages/error', {
            message: 'email or code not found',
            title: "Error"
        })
    }

    user = await User.getById(user[0]._id)
    if (user == null) {
        return res.render('pages/error', { message: "_id not found", title: "Error" })
    }

    await user.update({ validated: true })

    res.render('user/validated', {title: "Error"})
})

module.exports = router