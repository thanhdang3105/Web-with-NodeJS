const siteRoutes = require('./site')
const productRoutes = require('./products')

function routes(app) {

    app.use('/products', productRoutes)

    app.use('/',siteRoutes)
}

module.exports = routes