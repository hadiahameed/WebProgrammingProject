const createError = require('http-errors');
const express = require('express');
const path = require('path');
const exphbs = require("express-handlebars");
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const layouts = require('handlebars-layouts');

const app = express();

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

// handlebars and public
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
hbs.handlebars.registerHelper(layouts(hbs.handlebars));

const static = express.static(__dirname + '/public')
app.use("/public", static);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
