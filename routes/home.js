var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  if (!req.user)
    res.render("pages/index", {
      title: 'Log in'
    });
  else {
    res.render('newsfeed/newsfeed', {
      user: req.user,
      feed_user: req.user,
      isMe: true,
      title: "Newsfeed"
    })
  }
});

module.exports = router;