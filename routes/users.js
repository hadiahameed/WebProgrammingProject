const express = require('express');
const router = express.Router();
const reCaptcha = require('../middlewares/reCaptcha')
const userModel = require('../model/user')
const sendMail = require('../helpers/sendMail')
const validator = require('validator')
const config = require('config')
const url = require('url')

router.post('/', reCaptcha, async (req, res, next) => {
  let firstname = req.body.firstname,
      lastname  = req.body.lastname,
      username  = req.body.username,
      email     = req.body.email,
      password  = req.body.password
  
  if (!firstname || !lastname || !username || !email || !password) {
    res.status(400).json({ success: false, msg: 'missing parameter(s)'})
    return
  }

  if (validator.isEmail(email) == false) {
    return res.status(400).json({ success: false, msg: 'invalid email' })
  }

  try {
    let User = await userModel()
    let user = await User.getBy({ email })
    /**
     * Check if the user has registered
     */
    if (user.length != 0) {
      return res.json({
        success: false,
        msg: 'This email has registered. Please change it or login'
      })
    }

    let validation_code = parseInt(Math.random() * 100000000)
    user = new User({ firstname,lastname,username, email, password, validated: false, validation_code: validation_code })
    await user.save()
    let str = new url.URLSearchParams()
    str.append('code', validation_code)
    str.append('email', email)
    let link = `${config.get('siteConfig.url')}/validate?${str.toString()}`
    await sendMail({
      to: email,
      html: `
      Thanks for your registration. Please validate your email address by clicking the <a href="${link}" target="_blank"> link </a> or copy and paste the link below: <br> ${link}
      `,
      subject: 'Please Validate Your Email'
    })
    res.json({ success: true })
  }
  catch(e) {
    res.status(500).json({ success: false, msg: e.message })
  }
})

router.get("/:id", async (req, res) => {
  try {
    let User = await userModel()
    res.send(await User.getById(req.params.id))
  } catch (e) {
    res.status(404).json({ error: "User not found" });
  }
})

module.exports = router;
