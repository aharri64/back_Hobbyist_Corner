const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
    content: {
        type: String,
        minLength: 1,
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
