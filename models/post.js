const { Schema, model } = require('mongoose');

const postSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    caption: {
        type:String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    images: {
        type: [String],
        required: true
    },
    likes: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    comments: {
        type: [Schema.Types.ObjectId],
        ref: 'Comment',
        default: []
    }
});

module.exports = model('Post', postSchema);