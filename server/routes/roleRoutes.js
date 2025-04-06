const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const userController = require('../controllers/userController'); // Импорт userController для middleware

// Маршруты
router.get('/', userController.authenticateToken, roleController.getAllRoles);
router.post('/', userController.authenticateToken, roleController.createRole);
router.put('/:id', userController.authenticateToken, roleController.updateRole);
router.delete('/:id', userController.authenticateToken, roleController.deleteRole);

module.exports = router;