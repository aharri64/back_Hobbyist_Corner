const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new Schema({
    projectName: {
        type: String,
        required: true,
        minlength: 3,
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now()
    },
    category: {
        type: String,
    },
    refUser: {
        type: String,
        ref: 'user_id',
    },
    update: {
        type: String,
        ref: 'project_id',
    }
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
