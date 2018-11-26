const homeRouter = require('./home')
const usersRouter = require('./users');
const booksRouter = require('./books');
const vlaidateRouter = require('./validate')
const loginRouter = require('./login');
//const logoutRouter = require('/logout');
const userProfileRouter = require('./userProfile');

module.exports = app => {
    app.use('/', homeRouter)
    // app.use('/users', usersRouter)
    // app.use('/validate', vlaidateRouter)
    // app.use('/books', booksRouter)
    // app.use('/login',loginRouter);
    // //app.use('/logout',logoutRouter);
    // app.use('/userProfileRouter',userProfileRouter);
    // app.use('*', async (req, res, next) => {
    //     res.status(404)
    //     res.render('pages/error', {
    //         error: "Could not find this page"
    //     })
    // })

    // // Please ignore this, this is just for easy testing purposes for the handlebars
    // app.get('/', function(req, res, next) {
    //     res.render("books/books", { firstName: 'Sanne' });
    // })
}