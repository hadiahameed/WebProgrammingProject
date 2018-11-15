var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("pages/index", { title: 'Log in' });
  // if logged in: "pages.home"
});

module.exports = router;