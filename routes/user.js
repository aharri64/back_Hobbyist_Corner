const router = require('express').Router();
const ctrl = require('../controllers');
const passport = require('passport');


router.get('/test', passport.authenticate('jwt'), ctrl.user.test);
router.post('/register', ctrl.user.register);
router.post('/login', ctrl.user.login);
router.get('/profile', passport.authenticate('jwt'), ctrl.user.profile); 
router.post('/profile', ctrl.user.profilePost); 
router.get('/messages', passport.authenticate('jwt'), ctrl.user.messages); 
router.get('/allprofiles', ctrl.user.allProfiles);
router.get('/profile/:user_id', ctrl.user.profileById);
router.delete('/profile', passport.authenticate('jwt'), ctrl.user.deleteProfile);
//* posts
router.post('/newpost', passport.authenticate('jwt'), ctrl.user.newPost); // ? add a post
router.get('/posts', passport.authenticate('jwt'), ctrl.user.posts); //? get all posts
router.get('/posts/:id', passport.authenticate('jwt'), ctrl.user.postById); //? get one post by id
router.delete('/posts/:id', passport.authenticate('jwt'), ctrl.user.deletePost); //? delete a post
//* like and unlike
router.put('/posts/like/:id', passport.authenticate('jwt'), ctrl.user.postLike); // ? like a post
router.put('/posts/unlike/:id', passport.authenticate('jwt'), ctrl.user.postUnlike); // ? unlike a post
//* comments
router.post('/posts/comment/:id', passport.authenticate('jwt'), ctrl.user.newComment); // ? add a comment
router.delete('/posts/comment/:id/:comment_id', passport.authenticate('jwt'), ctrl.user.deleteComment); // ? delete a comment
router.post('/images', ctrl.user.images); // ? cloudinary images








module.exports = router;