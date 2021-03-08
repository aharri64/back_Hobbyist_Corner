const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectUpdateSchema = new Schema({
    projectUpdateName: {
        type: String,
        required: true,
        minlength: 3,
    },
    descriptionUpdate: {
        type: String,
    },
    imageUpdate: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now()
    },
    comment: {
        type: String,
        ref: 'comment_id'
    }
});

const ProjectUpdate = mongoose.model('ProjectUpdate', projectUpdateSchema);

module.exports = ProjectUpdate;