const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.get('/:ticketId/comments', commentController.getComments);
router.post('/:ticketId/comments', commentController.addComment);

module.exports = router;
