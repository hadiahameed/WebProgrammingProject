/* Middlewares */
const authenticate = require('../middlewares/authenticate')

/* Page Routes */
const homeRouter = require('./home')
const usersRouter = require('./users');
const booksRouter = require('./books');
const vlaidateRouter = require('./validate')
const bookshelfRouter = require('./bookshelves');
const userProfileRouter = require('./userProfile');
const profileEditRouter = require('./profileEdit');
const timelineRouter = require('./timeline')
const reviewRouter = require('./review');
const searchRouter = require('./search');

/* API Routes */
const api = require('./api')

module.exports = app => {
    /**
     * Fully accessible
     */
    app.use('/', homeRouter)
    app.use('/validate', vlaidateRouter)

    /**
     * Authentication required
     */
    let requireAuthenticationRoutes = {
        '/books': booksRouter,
        '/bookshelves': bookshelfRouter,
        '/profileEdit': profileEditRouter,
        '/user': userProfileRouter,
        '/review': reviewRouter
    }

    for(let route in requireAuthenticationRoutes) {
        app.use(route, authenticate(), requireAuthenticationRoutes[route])
    }

    /**
     * Access Control in routes
     */
    app.use('/users', usersRouter)
    app.use('/timeline', timelineRouter)

    /**
     * Load API Route
     */
    app.use('/api', api)

    // // Please ignore this, this is just for easy testing purposes for the handlebars
    // app.get('/', function(req, res, next) {
    //     res.render("books/books", { firstName: 'Sanne' });
    // })
}