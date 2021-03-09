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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    }
    
});

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
    comments: [commentSchema],
    
});

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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    updates: [projectUpdateSchema]
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
