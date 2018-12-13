const express = require('express');
const router = express.Router();
const reCaptcha = require('../middlewares/reCaptcha')
const userModel = require('../model/user')
const sendMail = require('../helpers/sendMail')
const validator = require('validator')
const config = require('config')
const url = require('url')
const bcrypt = require("bcrypt");
const authenticate = require('../middlewares/authenticate')
const xss = require('xss');

router.post('/', reCaptcha(true), async (req, res, next) => {
  let firstname = xss(req.body.firstname),
      lastname  = xss(req.body.lastname),
      username  = xss(req.body.username),
      email     = xss(req.body.email),
      password  = xss(req.body.password)
  
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
    user.push(...await User.getBy({username}))
    /**
     * Check if the user has registered
     */
    if (user.length != 0) {
      return res.json({
        success: false,
        msg: 'This email or username has registered. Please change it or login'
      })
    }

    let validation_code = parseInt(Math.random() * 100000000)
    let bookshelves = [
      {
        name: "Read",
        books: []
      },
      {
        name: "Currently Reading",
        books: []
      },
      {
        name: "Want to Read",
        books: []
      }
    ]
    const saltRounds = 16;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    user = new User({ 
      firstname,
      lastname,
      username,
      email,
      password: hashedPassword,
      validated: false,
      validation_code: validation_code,
      bookshelves: bookshelves,
      followers: [],
      following: [],
      feeds: [],
      timeline: [],
      image: ''
    })
    
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

router.get("/:username/following", authenticate(), async (req, res) => {
  try {
    let User = await userModel()
    let result = (await User.getBy({ username: xss(req.params.username) }, {
      projection: ['following']
    }))
    if(result.length == 0) {
      return next(new Error('User Not Found'))
    }
    let following_id = result[0].following
    let following = await User.getBy({ _id: {$in: following_id }})

    res.render('user/following.handlebars', {
      empty: !following || following.length == 0,
      following,
    })

  } catch (e) {
    res.status(404).json({ error: "User not found" });
  }
})

router.get("/:username/followers", authenticate(), async (req, res) => {
  try {
    let User = await userModel()
    let result = (await User.getBy({ username: xss(req.params.username) }, {
      projection: ['followers']
    }))
    if(result.length == 0) {
      return next(new Error('User Not Found'))
    }
    let followers_id = result[0].followers

    let followers = await User.getBy({ _id: {$in: followers_id }})

    res.render('user/followers.handlebars', {
      empty: !followers || followers.length == 0,
      followers
    })

  } catch (e) {
    res.status(404).json({ error: "User not found" });
  }
})

module.exports = router;
