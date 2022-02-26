const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;


const TypeProducts = new Schema({
    type: {
        type: String,
        required: true,
        unique: true,
    },
    miniType: {
        type: Array,
        unique: true,
    },
    slug: {
        type: String,
        slug: 'type',
        unique: true
    }
})

mongoose.plugin(slug)

module.exports = mongoose.model('TypeProducts', TypeProducts)