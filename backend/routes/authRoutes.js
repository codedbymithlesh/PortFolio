const express = require('express');
const router = express.Router();
const { login, changePassword, requestOTP, verifyOTPReset } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', login);
router.put('/change-password', authMiddleware, changePassword);
router.post('/request-otp', requestOTP);
router.post('/verify-otp', verifyOTPReset);

module.exports = router;
