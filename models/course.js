const {Schema, model} = require('mongoose');

const opts = {
    toObject: {
        virtuals: true,
    },
    toJSON: {
        virtuals: true,
    },
};

const course = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: String
}, opts);

module.exports = model('Course', course);