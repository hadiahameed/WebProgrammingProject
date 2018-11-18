const homeRouter = require('./home')
const usersRouter = require('./users');
const booksRouter = require('./books');
const vlaidateRouter = require('./validate')

module.exports = app => {
    app.use('/', homeRouter)
    app.use('/users', usersRouter)
    app.use('/validate', vlaidateRouter)
    app.use('/books', booksRouter)
}