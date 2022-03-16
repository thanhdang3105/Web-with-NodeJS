const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const User = new Schema({
    accountName: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
    },
    birthday: {
        type: String,
        default: ''
    },
    sex: {
        type: String,
        default: ''
    },
    phoneNumber: {
        type: Array,
    },
    address: {
        type: Array,
    }
})

module.exports = mongoose.model('User', User)