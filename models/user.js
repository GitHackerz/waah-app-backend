const { Schema, model } = require('mongoose');
const { hash } = require('bcrypt');
require('dotenv').config();

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    email: {
        type:String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type:String,
        required: true,
        trim: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'superadmin'],
        default: 'user'
    },
    avatar: {
        type: String,
        default: ''
    },
    isBanned: {
        type: Boolean,
        default: false
    }
});

userSchema.pre('save', async function(next) {
    const user = this;
    const SALT = Number(process.env.SALT);
    if (!user.isModified('password'))
        return next();

    user.password = await hash(user.password, SALT);
    next();
});

module.exports = model('User', userSchema);