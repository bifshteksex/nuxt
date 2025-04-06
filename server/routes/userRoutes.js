const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Маршруты
router.get('/me', userController.authenticateToken, userController.getUser);
router.get('/:id', userController.authenticateToken, userController.getUserById);
router.get('/', userController.authenticateToken, userController.getAllUsers);
router.put('/:id', userController.authenticateToken, userController.updateUser);
router.delete('/:id', userController.authenticateToken, userController.deleteUser);

module.exports = router;