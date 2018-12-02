const BaseError = require('../errors/BaseError')

module.exports = (api=false) => {
    return async (req, res, next) => {
        if(!req.user) {
            if(api) {
                return next(new BaseError('Please Login'))
            }
            else {
                res.status('400').redirect('/')
            }    
        }
        next()
    }
}