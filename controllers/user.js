// Imports
require('dotenv').config();
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// Database
const db = require('../models');

// Controllers
const test = (req, res) => {
    res.json({ message: 'User endpoint OK! ✅' });
}


const register = (req, res) => {
    // POST - adding the new user to the database
    console.log('===> Inside of /register');
    console.log('===> /register -> req.body');
    console.log(req.body);

    db.User.findOne({ email: req.body.email })
    .then(user => {
        // if email already exists, a user will come back
        if (user) {
            // send a 400 response
            return res.status(400).json({ message: 'Email already exists' });
        } else {
            // Create a new user
            const newUser = new db.User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            // Salt and hash the password - before saving the user
            bcrypt.genSalt(10, (err, salt) => {
                if (err) throw Error;

                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) console.log('==> Error inside of hash', err);
                    // Change the password in newUser to the hash
                    newUser.password = hash;
                    newUser.save()
                    .then(createdUser => res.json(createdUser))
                    .catch(err => console.log(err));
                });
            });
        }
    })
    .catch(err => console.log('Error finding user', err))
}

const login = async (req, res) => {
    // POST - finding a user and returning the user
    console.log('===> Inside of /login');
    console.log('===> /login -> req.body');
    console.log(req.body);

    const foundUser = await db.User.findOne({ email: req.body.email });

    if (foundUser) {
        // user is in the DB
        let isMatch = await bcrypt.compare(req.body.password, foundUser.password);
        console.log(isMatch);
        if (isMatch) {
            // if user match, then we want to send a JSON Web Token
            // Create a token payload
            // add an expiredToken = Date.now()
            // save the user
            const payload = {
                id: foundUser.id,
                email: foundUser.email,
                name: foundUser.name
            }

            jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
                if (err) {
                    res.status(400).json({ message: 'Session has endedd, please log in again'});
                }
                const legit = jwt.verify(token, JWT_SECRET, { expiresIn: 60 });
                console.log('===> legit');
                console.log(legit);
                res.json({ success: true, token: `Bearer ${token}`, userData: legit });
            });

        } else {
            return res.status(400).json({ message: 'Email or Password is incorrect' });
        }
    } else {
        return res.status(400).json({ message: 'User not found' });
    }
}

const profile = async (req, res) => {
    try {
        
        const profile = await db.Profile.findOne({ 
            user: req.user.id 
        }).populate('user', ['name']);
        console.log(req.user.id);
        console.log(profile);
        
        if (!profile) {
            return res.status(400).json({ message: 'There is no profile for this user'})
        } else {

            console.log('====> inside /profile');
            console.log(req.body);
            console.log('====> user')
            console.log(req.user);
            res.json(profile)
        }
        
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

}

const profilePost = async (req, res) => {
    const { company, website, location, skills, bio, youtube, facebook, twitter, linkedin, instagram } = req.body;
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    console.log(profileFields.skills);
    // build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;
    try {
        let profile = await db.Profile.findOne({ User: req.user.id })

        if (profile) {
            //Update
            profile = await db.Profile.findOneAndUpdate(
                { User: req.user.id }, 
                { $set: profileFields }, 
                { new: true } 
            );
            return res.json(profile)
        }
        //create
        profile = new db.Profile(profileFields)

        await profile.save();
        res.json(profile);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }


}

// private
// const profile = (req, res) => {
//     console.log('====> inside /profile');
//     console.log(req.body);
//     console.log('====> user')
//     console.log(req.user);
//     const { id, name, email } = req.user; // object with user object inside
//     res.json({ id, name, email });
// }

const messages = async (req, res) => {
    console.log('====> inside /messages');
    console.log(req.body);
    console.log('====> user')
    console.log(req.user);
    const { id, name, email } = req.user; // object with user object inside
    const messageArray = ['message 1', 'message 2', 'message 3', 'message 4', 'message 5', 'message 6', 'message 7', 'message 8', 'message 9'];
    const sameUser = await db.User.findOne({ _id: id });
    res.json({ id, name, email, message: messageArray, sameUser });
}

// Exports
module.exports = {
    test,
    register,
    login,
    profile,
    profilePost,
    messages,
}