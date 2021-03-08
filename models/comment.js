const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
        minlength: 3,
    },
    date: {
        type: Date,
        default: Date.now()
    },
    refUserName: {
        type: String,
        ref: 'user_id',
    }
    
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;