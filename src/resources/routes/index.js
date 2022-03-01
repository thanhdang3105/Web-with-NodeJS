const siteRoutes = require('./site')
const productRoutes = require('./products')
const meRoutes = require('./me')

function routes(app) {

    app.use('/products', productRoutes)

    app.use('/me', meRoutes)

    app.use('/',siteRoutes)
}

module.exports = routes