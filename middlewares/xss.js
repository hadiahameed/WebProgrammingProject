const xss = require('xss')

module.exports = (req, res, next) => {
    // if (req.body) {
    //     req.body = JSON.parse(xss(JSON.stringify(req.body)))
    // }
    // if (req.params) {
    //     req.params = JSON.parse(xss(JSON.stringify(req.params)))
    // }
    // if (req.query) {
    //     req.query = JSON.parse(xss(JSON.stringify(req.query)))
    // }
    next()
}