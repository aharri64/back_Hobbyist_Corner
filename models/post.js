const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    profile: { 
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    },
    text: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    name: {
        type: String
    },
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ],
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            profile: { 
                type: Schema.Types.ObjectId,
                ref: 'Profile'
            },
            text: { 
                type: String, 
                required: true
            },
            image: {
                type: String
            },
            name: {
                type: String
            },
            avatar: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now()
            }
        },
    ],
    date: {
        type: Date,
        default: Date.now()
    }
})

const Post = mongoose.model('Post', postSchema);
module.exports = Post;