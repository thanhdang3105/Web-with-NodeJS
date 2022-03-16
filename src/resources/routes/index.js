const siteRoutes = require('./site')
const productRoutes = require('./products')
const meRoutes = require('./me')
const session = require('express-session')

function routes(app) {
    app.use(session({
        secret: 'userId',
        resave: true,
        saveUninitialized: true,
      }))

    app.use('/products', productRoutes)

    app.use('/me', meRoutes)

    app.use('/',siteRoutes)
}

module.exports = routes