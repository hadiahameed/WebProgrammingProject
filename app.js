const createError = require('http-errors');
const express = require('express');
const path = require('path');
const exphbs = require("express-handlebars");
const cookieParser = require('cookie-parser');
const layouts = require('handlebars-layouts');
const logger = require('morgan');
const router = require('./routes')
const session = require('express-session')
const passport = require('./middlewares/passport')


const app = express();
app.use(session({
  secret: 'just for test',
  resave: true,
  saveUninitialized: true
}))

/**
 * Initialize handlebars
 */
const hbs = exphbs.create({
  defaultLayout: "main",
  partialsDir: [
    'views/partials/'
  ]
})

hbs.getPartials({
  cache: true,
  precompiled:false
}).then((partials) => {
  hbs.handlebars.registerPartial(partials)
})

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
hbs.handlebars.registerHelper(layouts(hbs.handlebars));

/**
 * Set static/public folder
 */
const static = express.static(__dirname + '/public')
app.use("/public", static);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize())
app.use(passport.session())

/**
 * Set routes
 */
router(app)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page 
  res.status(err.status || 500);
  res.render("pages/error");
  // ^^ this should render whatever page and pass in error: true
});

module.exports = app;
