const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CartProducts = new Schema({
    userId: {
        type: String
    },
    slug: {
        type: String,
    },
    size: {
        type: String,
    },
    color: {
        type: String,
    },
    count: {
        type: Number,
    }
})


module.exports = mongoose.model('CartProducts', CartProducts)