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

userSchema.methods.addToCard = function (course){
    const items = [...this.card.items]
    const idx = items.findIndex(c =>{
        return c.courseId.toString() === course._id.toString()
    })

    if (idx >= 0){
        items[idx].count += 1
    } else {
        items.push({
            courseId : course._id,
            count : 1
        })
    }

    this.card = {items}
    return this.save()
}


module.exports = model('User', userSchema)