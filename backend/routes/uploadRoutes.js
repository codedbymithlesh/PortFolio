const express = require('express');
const router = express.Router();
const { uploadFile } = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/profile', authMiddleware, upload.single('image'), uploadFile);
router.post('/project', authMiddleware, upload.single('image'), uploadFile);

module.exports = router;
