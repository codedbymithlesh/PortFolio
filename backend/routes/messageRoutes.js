const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, markAsRead, deleteMessage } = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', sendMessage);
router.get('/', authMiddleware, getMessages);
router.patch('/:id/read', authMiddleware, markAsRead);
router.delete('/:id', authMiddleware, deleteMessage);

module.exports = router;
