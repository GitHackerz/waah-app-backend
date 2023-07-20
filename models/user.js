const {Schema, model} = require('mongoose');

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

module.exports = model('User', userSchema);