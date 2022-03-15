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
        type: Date,
        default: ''
    },
    sex: {
        type: String,
        default: ''
    },
    phoneNumber: {
        type: Number,
    },
    address: {
        type: String,
    }
})

module.exports = mongoose.model('User', User)