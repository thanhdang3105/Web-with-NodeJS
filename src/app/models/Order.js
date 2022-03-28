const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Order = new Schema({
    userId: {
        type: String
    },
    Name: {
        type: String,
    },
    Phone: {
        type: String,
    },
    Address: {
        type: String,
    },
    TP: {
        type: String,
    },
    District: {
        type: String,
    },
    shipperCheck: {
        type: String,
    },
    Products:{
        type: Array,
    },
    datedAt: {
        type: Date,
        default: Date.now(),
    },
    totalPrice: {
        type: String,
    }
})


module.exports = mongoose.model('Order', Order)