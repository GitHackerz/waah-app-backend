const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type:String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    }
});

module.exports = model('Comment', commentSchema);