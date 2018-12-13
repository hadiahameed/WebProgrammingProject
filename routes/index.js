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
const xss = require('../middlewares/xss');

/* API Routes */
const api = require('./api')

module.exports = app => {
    app.use((req, res, next) => {
        let route = req.url.split('/')
        if(route.length > 1) {
            res.locals.navbar_active = route[1]
        }
        else {
            res.locals.navbar_active = 'home'
        }
        console.log(route)
        next()
    })
    
    /**
     * Fully accessible
     */
    app.use('/', xss, homeRouter)
    app.use('/validate', xss, vlaidateRouter)
    app.use('/search', xss, searchRouter)
    
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
        app.use(route, xss, authenticate(), requireAuthenticationRoutes[route])
    }

    /**
     * Access Control in routes
     */
    app.use('/users', xss, usersRouter)
    app.use('/timeline', timelineRouter)

    /**
     * Load API Route
     */
    app.use('/api', xss, api)

}