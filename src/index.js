const path = require('path')

const express = require('express')
const hbs = require('express-handlebars')
const db = require('./config/db')
const routes = require('./resources/routes')
const methodOverride = require('method-override')

const app = express()
const port = 3000

db.connect()

//Định nghĩa tuyến đường tĩnh
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({
    extended: true,
}))
app.use(express.json())

app.use(methodOverride('_method'))

//set template engine
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    helpers:{
        checkActive: (index) => {
            return Number(index) == 0 ? 'active' : ''
        },
        setDSBbtn: (current,pages) => {
            return Number(current) == Number(pages) ? 'disabled' : ''
        },
        pagination: (current,action) => {
            return Number(current) + Number(action)
        },
        renderPage: (pages ,current) =>{
            var arr = []
            for(var i = 1;i <= pages; i++){
                if(i == current){
                    arr.push({
                        page: i,
                        active: 'active'
                    })
                }
                else if (i == Number(current) + 3 && i < pages) {
                    arr.push({
                        page: '...',
                        active: 'disabled'
                    })
                    return arr
                }
                else{
                    arr.push({
                        page: i,
                        active: ''
                    })
                }
            }
            return arr
        },
        setViewaddress: (address,phone) => {
            var arr = []
            if(address.length > 0){
                address.map((Address, index) =>{
                    arr.push({
                        address: Address,
                        phoneNumber: phone[index]
                    })
                })
            }
            else{
                arr = {
                    address: address,
                    phoneNumber: phone
                }
            }
            return arr
        },
        checkSex: (data,value) =>{
            if(data === value){
                return 'checked'
            }
            if(data === '' && value === 'Nam'){
                return 'checked'
            }
        }
    }
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'resources', 'views'))

//Khởi tạo router
routes(app)
//Lắng nghe sever
app.listen((process.env.PORT || 3000), () =>{
    console.log(`App listening at http://localhost:${(process.env.PORT || 3000)}/`)
})
