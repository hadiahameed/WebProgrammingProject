var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.cookies.AuthCookie)
    res.render("pages/index", { title: 'Log in' });
  else
  // if logged in: "pages.home"
    res.render("pages/home",{title:"Welcome to the home page"});
});

module.exports = router;
