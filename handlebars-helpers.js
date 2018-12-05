const helpers = require('handlebars-helpers')()

module.exports = handlebars => {
    for (let helper in helpers) {
        handlebars.registerHelper(helper, helpers[helper])
    }
}