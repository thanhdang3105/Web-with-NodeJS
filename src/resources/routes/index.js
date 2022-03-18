const siteRoutes = require('./site')
const productRoutes = require('./products')
const meRoutes = require('./me')
const session = require('express-session')
const middleware = require('../../app/middleware/middleware')

function routes(app) {
    app.use(session({
        secret: 'userId',
        resave: true,
        saveUninitialized: true,
      }),middleware)

    app.use('/products', productRoutes)

    app.use('/me', meRoutes)

    app.use('/',siteRoutes)
}

module.exports = routes