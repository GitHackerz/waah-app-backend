const { Schema, model } = require('mongoose');
const UserModel = require('./user');
const PostModel = require('./post');

const reportSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['Post', 'User']
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Resolved'],
        default: 'Pending'
    },
    reason: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reporterId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    resolverId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    resolvedAt: {
        type: Date
    }
});

reportSchema.pre('save', async function(next) {
    try {
        const report = this;
        if (!report.isModified('postId') && !report.isModified('userId'))
            return next(new Error('Post or User must be specified'));

        if (report.isModified('postId') && report.isModified('userId'))
            return next(new Error('Post or User must be specified, not both'));

        if (report.isModified('postId')) {
            const existedPost = await PostModel.findById(report.postId);
            if (!existedPost)
                return next(new Error('Post not found'));
        }

        if (report.isModified('userId')) {
            const existedUser = await UserModel.findById(report.userId);
            if (!existedUser)
                return next(new Error('User not found'));
        }
        next();
    } catch (err) {
        console.log(err);
        next(err);
    }
});

module.exports = model('Report', reportSchema);

