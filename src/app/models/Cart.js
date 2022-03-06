const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CartProducts = new Schema({
    _id: {
        type: String,
        required: true,
        unique: true,
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