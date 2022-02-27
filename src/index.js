const path = require('path')

const express = require('express')
const hbs = require('express-handlebars')
const db = require('./config/db')
const routes = require('./resources/routes')

const app = express()
const port = 3000

db.connect()

//Định nghĩa tuyến đường tĩnh
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({
    extended: true,
}))
app.use(express.json())

//set template engine
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    helpers: {
        check: (data,target) => {
            target.onchange = (e) => {
                if(e.target.value === data.type){
                    data.miniType.map(miniType =>{
                        return `<option value="${miniType}">${miniType}</option>`
                    })
                }
            }
        }
    }
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'resources', 'views'))

//Khởi tạo router
routes(app)
//Lắng nghe sever
app.listen(port, () =>{
    console.log(`App listening at http://localhost:${port}/`)
})
