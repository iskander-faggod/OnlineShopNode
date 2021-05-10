const {Schema, model} = require('mongoose');
const opts = {
    toObject: {
        virtuals: true,
    },
    toJSON: {
        virtuals: true,
    },
};

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    card: {
        items: [
            {
                count:{
                    type:Number,
                    required: true,
                    default: 0
                },
                courseId:{
                    type: Schema.Types.ObjectId,
                    ref: 'Course',
                    required:true,
                }
            }
        ]
    }

}, opts)

module.exports = model('User', userSchema)