const router = require('express').Router();
const ctrl = require('../controllers');
const passport = require('passport');

router.get('/test', ctrl.user.test);
router.post('/register', ctrl.user.register);
router.post('/login', ctrl.user.login);
router.get('/profile', passport.authenticate('jwt', { session: false }), ctrl.user.profile); // session: false ???
router.post('/profile', passport.authenticate('jwt', { session: false }), ctrl.user.profilePost); // session: false ???
router.get('/messages', passport.authenticate('jwt', { session: false }), ctrl.user.messages); // session: false ???


module.exports = router;