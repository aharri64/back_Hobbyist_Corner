const router = require('express').Router();
const ctrl = require('../controllers');

// routes
router.get('/', ctrl.project.index);
router.post('/', ctrl.project.create);

// exports
module.exports = router;