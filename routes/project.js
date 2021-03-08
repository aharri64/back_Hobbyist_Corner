const router = require('express').Router();
const ctrl = require('../controllers');

// routes
router.get('/', ctrl.project.index);


// exports
module.exports = router;