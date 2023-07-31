const { Schema, model } = require('mongoose');
const UserModel = require('./user');

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
        required: true,
        default: []
    },
    likes: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    comments: {
        type: [commentSchema],
        default: []
    }
}, { timestamps: true });

postSchema.pre('save', async function(next) {
    try {
        const post = this;
        if (!post.isModified('author'))
            return next();

        const existedUser = await UserModel.findById(post.author);
        if (!existedUser)
            return next(new Error('User not found'));
        next();
    } catch (err) {
        console.log(err);
        next(err);
    }
});

postSchema.pre('findOneAndUpdate', async function(next) {
    try {
        const post = this._update;
        console.log(post);

        if (!post.author)
            return next();
        const existedUser = await UserModel.findById(post.author);
        if (!existedUser)
            return next(new Error('User not found'));
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = model('Post', postSchema);