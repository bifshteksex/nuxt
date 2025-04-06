const express = require('express');
const router = express.Router();
const statusController = require('../controllers/statusController');
const userController = require('../controllers/userController');

// Маршруты
router.put('/position', userController.authenticateToken, statusController.updateStatusPositions);
router.get('/', userController.authenticateToken, statusController.getAllStatuses);
router.post('/', userController.authenticateToken, statusController.createStatus);
router.put('/:id', userController.authenticateToken, statusController.updateStatus);
router.delete('/:id', userController.authenticateToken, statusController.deleteStatus);

module.exports = router;