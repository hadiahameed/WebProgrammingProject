var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  /* Check if the cookie named 'AuthCookie' exists
   * If exits navigate to home page
   * If not render the login page
   */
  if(!req.user)
    res.render("pages/index", { title: 'Log in' });
  else
    //if logged in: "pages.home"
    res.redirect('/user/profile') // ("user/userProfile",{title:"Welcome to the home page"});
});

module.exports = router;
