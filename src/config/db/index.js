const mongoose = require('mongoose')

async function connect() {

    try{
        await mongoose.connect('mongodb://localhost:27017/StoreManage')
        console.log('Connect Successfully')
    } catch(err) {
        console.log('Connect Failed:' + err)
    }
}

module.exports = { connect }