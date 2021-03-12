const mongoose = require('mongoose');
const { Schema } = mongoose;

const profileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    company: {
        type: String,
    },
    website: {
        type: String
    },
    location: {
        type: String
    },
    skills: {
        type: [String]
    },
    bio: {
        type: String
    },
    social: {
        youtube: {
            type: String
        },
        twitter: {
            type: String
        },
        facebook: {
            type: String
        },
        linkedin: {
            type: String
        },
        instagram: {
            type: String
        }
    },
    date: {
    type: Date,
    default: Date.now
    }
})

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;