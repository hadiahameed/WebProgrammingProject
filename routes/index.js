/* Middlewares */
const authenticate = require('../middlewares/authenticate')

/* Routes */
const homeRouter = require('./home')
const usersRouter = require('./users');
const booksRouter = require('./books');
const vlaidateRouter = require('./validate')
const loginRouter = require('./login');
const bookshelfRouter = require('./bookshelves');
const logoutRouter = require('./logout');
const userProfileRouter = require('./userProfile');
const profileEditRouter = require('./profileEdit');
const session = require('./session')

module.exports = app => {
    /**
     * Fully accessible
     */
    app.use('/', homeRouter)
    app.use('/validate', vlaidateRouter)
    app.use('/session', session)
    app.use('/login',loginRouter);

    /**
     * Authentication required
     */
    let requireAuthenticationRoutes = {
        '/users': usersRouter,
        '/books': booksRouter,
        '/bookshelves': bookshelfRouter,
        '/logout': logoutRouter,
        '/profileEdit': profileEditRouter,
        '/user/profile': userProfileRouter,
    }

    for(let route in requireAuthenticationRoutes) {
        app.use(route, authenticate(), requireAuthenticationRoutes[route])
    }

    // Please ignore this, this is just for easy testing purposes for the handlebars
    app.get('/', function(req, res, next) {
        res.render("books/books", { firstName: 'Sanne' });
    })
}