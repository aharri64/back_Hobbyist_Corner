const router = require('express').Router();
const ctrl = require('../controllers');

// routes
router.get('/', ctrl.project.index);
// router.get('/:id', ctrl.project.show);
// router.post('/', ctrl.project.create);
// router.put('/:id', ctrl.project.update);
// router.delete('/:id', ctrl.project.destroy);

// exports
module.exports = router;