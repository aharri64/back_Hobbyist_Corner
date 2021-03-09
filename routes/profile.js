const router = require('express').Router();
const ctrl = require('../controllers');
const passport = require('passport');

// routes

router.get('/profile', passport.authenticate('jwt', { session: false }), ctrl.profile.profile);

// exports
module.exports = router;