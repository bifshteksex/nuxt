const express = require('express');
const router = express.Router();
const priorityController = require('../controllers/priorityController');

router.get('/', priorityController.getAllPriorities);
router.get('/:id', priorityController.getPriorityById);
router.post('/', priorityController.createPriority);
router.put('/:id', priorityController.updatePriority);
router.delete('/:id', priorityController.deletePriority);

module.exports = router;