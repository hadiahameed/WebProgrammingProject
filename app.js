const Errors = require('./errors')
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const layouts = require('handlebars-layouts');
const logger = require('morgan');
const router = require('./routes');
//const passport = require('passport');
const passport = require('./middlewares/passport');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

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
app.use(bodyParser.json({ limit: '4MB' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Express session
app.use(session({
  secret:'secret',
  saveUninitialized:true,
  resave:true
}));

// initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

//Express Validator
app.use(expressValidator({
  errorFormatter:function(param,msg,value) {
    var namespace = param.split('.')
    ,root = namespace.shift()
    ,formParam = root;

    while(namespace.length)
    {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg:msg,
      value:value
    };
  }
}));

//Connect Flash
app.use(flash());
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
  if (err instanceof Errors.BaseError) {
    return res.status(err.status).json(err.errObj)
  }
  
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page 
  res.status(err.status || 500);
  res.render("pages/error");
});


module.exports = app;
