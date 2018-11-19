const homeRouter = require('./home')
const usersRouter = require('./users');
const booksRouter = require('./books');
const vlaidateRouter = require('./validate')
//const loginRouter = require('./login');
//const logoutRouter = require('/logout');
const userProfileRouter = require('./userProfile');

module.exports = app => {
    app.use('/', homeRouter)
    app.use('/users', usersRouter)
    app.use('/validate', vlaidateRouter)
    app.use('/books', booksRouter)
    //app.use('/login',loginRouter);
    //app.use('/logout',logoutRouter);
    app.use('/userProfileRouter',userProfileRouter);
}