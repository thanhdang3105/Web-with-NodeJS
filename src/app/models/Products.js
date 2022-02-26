const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;


const Products = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
    },
    color:{
        type: String,
    },
    size:{
        type:String,
    },
    imageProducts:{
        type: Array,
    },
    description:{
        type: String,
        maxlength:500,
    },
    type:{
        type: String,
    },
    miniType:{
        type: String,
    },
    datedAt: {
        type: Date,
        default: Date.now(),
    }
    ,
    slug: {
        type: String,
        slug: 'name',
        unique: true
    }
})

mongoose.plugin(slug)

module.exports = mongoose.model('Products', Products)