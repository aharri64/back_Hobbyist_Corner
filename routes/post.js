const router = require('express').Router();
const ctrl = require('../controllers');
const passport = require('passport');

router.get('/test', passport.authenticate('jwt', { session: false }), ctrl.post.test);

module.exports = router;