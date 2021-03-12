// Imports
require('dotenv').config();
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const gravatar = require('gravatar')
const normalize = require('normalize-url');
// Database
const db = require('../models');
const { post } = require('../routes');

// Controllers
const test = (req, res) => {
    res.json({ message: 'User endpoint OK! ✅' });
}

/* 
* table of contents ======================================>
    * register - line - public
    * login - line - public
    * get profile - line - private
    * Post on Profile - line - private
    * Get all Profiles - line - public
    * Get Profile by user id - line - public
    * Delete user - line - private
*/


// * register ======================================>
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

            // ADD gravatar
            const avatar = normalize(gravatar.url(req.body.email, {
                s: '200', 
                r: 'pg',
                d: 'mm'
            }), { forceHttps: true });
            // Create a new user
            const newUser = new db.User({
                name: req.body.name,
                email: req.body.email,
                avatar: avatar,
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

// * login ======================================>
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

            const foundProfile = await db.Profile.findOne({
                user: foundUser.id
            })
            
            console.log("***********************")
            console.log(foundProfile)
            console.log(foundUser)
            // if user match, then we want to send a JSON Web Token
            // Create a token payload
            // add an expiredToken = Date.now()
            // save the user
            const payload = {
                id: foundUser.id,
                email: foundUser.email,
                avatar: foundUser.avatar,
                name: foundUser.name,
                profile: foundProfile
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

// * get the users profile ======================================>
const profile = async (req, res) => {

    try {
        
        const profile = await db.Profile.findOne({ 
            user: req.user.id 
        }).populate('user', ['name', 'avatar']);
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

// * Post to a profile ======================================>
const profilePost = async (req, res) => {
    const { avatar, company, website, location, skills, bio, youtube, facebook, twitter, linkedin, instagram } = req.body;
    const profileFields = {};
    profileFields.user = req.user.id;
    if (avatar) profileFields.avatar = avatar;
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

// * Get all profiles ======================================>
const allProfiles = async (req, res) => {
    try {
        const allProfiles = await db.Profile.find().populate('user',  ['name', 'avatar']);
        res.json(allProfiles);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
}

// * get profile by user id =================================> 
const profileById =  async (req, res) => {
    try {
        const profileById = await db.Profile.findOne({ 
            user: req.params.user_id 
        }).populate('user', ['name']);
        if (!profile) {
            return res.status(400).json({ message: 'There is no profile for this user'})
        }
        res.json(profileById);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ message: 'Profile not found'})
        }
        res.status(500).send('Server error')
    }
}

// * Delete Profile & User=======================================>
const deleteProfile = async (req, res) => {
    try {
        //TODO - remove users posts
        //! remove profile
        await db.Profile.findOneAndRemove ({ user: req.user.id });
        //! remove User
        await db.User.findOneAndRemove ({ _id: req.user.id });
        res.json({ message: 'User deleted' })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
}

// * new Post ===============================================================>
const newPost = async (req, res) => {
    try {
        console.log('================================================> Hi!');
        console.log(req.user);
        const user = await db.User.findById(req.user._id).select('-password');

        const newPost = new db.Post ({
            text: req.body.text,
            name: user.name,
            avatar: profile.avatar,
            user: req.user.id
        });
        
        const post = await newPost.save();

        res.json(post);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
}

// * get Post ===============================================================> 
const posts = async (req, res) => {
    try {
        const posts =await db.Post.find().sort({ date: -1 });
        res.json(posts);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
}

// * Get Post By Id ===============================================================> 
const postById = async (req, res) => {
    try {
        const postById =await db.Post.findById(req.params.id);
        if(!posts) {
            return res.status(404).json({ message: 'No post found'})
        }

        res.json(postById);

    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'No post found'})
        }
        res.status(500).send('Server error')
    }
}

// * Delete Post ===============================================================> 
const deletePost = async (req, res) => {
    try {
        const posts = await db.Post.findById(req.params.id);

        if(!posts) {
            return res.status(404).json({ message: 'No post found'})
        }

        //Check User
        if (posts.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not Authorized'})
        }

        await posts.remove();

        res.json({ message: 'post removed successfully' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'No post found'})
        }
        res.status(500).send('Server error')
    }
}

// * Like a post =======================================================>
const postLike = async (req, res) => {
    try {
        const post = await db.Post.findById(req.params.id);

        //check if post has already been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ message: 'Post already has a like'})
        }

        post.likes.unshift({ user: req.user.id });

        await post.save();

        res.json(post.likes)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
}

// * Unlike a post =======================================================>
const postUnlike = async (req, res) => {
    try {
        const post = await db.Post.findById(req.params.id);

        //check if post has already been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ message: 'Post has not yet been liked'})
        }

        // get remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);

        await post.save();

        res.json(post.likes)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
}

// * new Comment ===============================================================>
const newComment = async (req, res) => {
    try {
        console.log('================================================> Hi!');
        console.log(req.user);
        const user = await db.User.findById(req.user._id).select('-password');
        const post = await db.Post.findById(req.params.id)

        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: profile.avatar,
            user: req.user.id
        };
        
        post.comments.unshift(newComment);

        await post.save();

        res.json(post.comments);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
}

// * Delete Comment ===============================================================>
const deleteComment = async (req, res) => {
    try {
        const post = await db.Post.findById(req.params.id)

        // pull comment from post
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        //make sure comment exists
        if (!comment) {
            return res.status(404).json({message: 'comment does not exist'})
        }

        //Check if user is the user who made the comments
        if (comment.user.toString() !== req.user.id) {
            return res.status(404).json({message: 'user not authorized'});
        }

        post.comments = post.comments.filter( ({ id }) => id !== req.params.comment_id);

        // const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);

        // post.comments.splice(removeIndex, 1);

        await post.save();

        res.json(post.comments)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
}

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
    allProfiles,
    profileById,
    deleteProfile,
    newPost,
    posts,
    postById,
    deletePost,
    postLike,
    postUnlike,
    newComment,
    deleteComment,
    messages,
}