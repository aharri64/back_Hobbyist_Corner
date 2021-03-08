const router = require('express').Router();
const ctrl = require('../controllers/');

router.get('/', ctrl.message.index);
router.get('/:id', ctrl.message.show);

module.exports = router;