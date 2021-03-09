// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const commentSchema = new Schema({
//     content: {
//         type: String,
//         required: true,
//         minlength: 3,
//     },
//     date: {
//         type: Date,
//         default: Date.now()
//     },
//     refUserName: {
//         type: String,
//         ref: 'user_id',
//     }
    
// });

// const projectUpdateSchema = new Schema({
//     projectUpdateName: {
//         type: String,
//         required: true,
//         minlength: 3,
//     },
//     descriptionUpdate: {
//         type: String,
//     },
//     imageUpdate: {
//         type: String,
//     },
//     date: {
//         type: Date,
//         default: Date.now()
//     },
//     comments: [commentSchema]
// });

// const ProjectUpdate = mongoose.model('ProjectUpdate', projectUpdateSchema);

// module.exports = ProjectUpdate;