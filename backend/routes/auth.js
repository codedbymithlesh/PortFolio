const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Settings = require('../models/Settings');
const router = express.Router();

// Auth middleware — verifies JWT
function auth(req, res, next) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
  try {
    jwt.verify(h.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Helper — verify a plain password against DB hash or .env fallback
async function verifyPassword(plain) {
  const setting = await Settings.findOne({ key: 'admin_password_hash' });
  if (setting) {
    return bcrypt.compare(plain.trim(), setting.value);
  }
  // Fallback to plain-text .env password
  return plain.trim() === (process.env.ADMIN_PASSWORD || '').trim();
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ message: 'Password is required' });
  try {
    const ok = await verifyPassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid password' });
    const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/auth/change-password — protected (JWT required + current password verification)
router.put('/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Both current and new password are required' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'New password must be at least 8 characters' });
  }
  try {
    const ok = await verifyPassword(currentPassword);
    if (!ok) return res.status(401).json({ message: 'Current password is incorrect' });

    const hash = await bcrypt.hash(newPassword, 12);
    await Settings.findOneAndUpdate(
      { key: 'admin_password_hash' },
      { key: 'admin_password_hash', value: hash },
      { upsert: true, new: true }
    );
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

const OTP = require('../models/OTP');
const nodemailer = require('nodemailer');

// ... existing auth middleware ...

// POST /api/auth/request-otp — Generate and send OTP to Email
router.post('/request-otp', async (req, res) => {
  const { email, phone } = req.body;
  
  if (!email || !phone) {
    return res.status(400).json({ message: 'Email and phone are required' });
  }

  // Verify details against .env
  const masterEmail = process.env.RECOVERY_EMAIL;
  const masterPhone = process.env.RECOVERY_PHONE;

  if (!masterEmail || !masterPhone) {
    return res.status(500).json({ message: 'Recovery details not configured in .env' });
  }

  if (email.trim().toLowerCase() !== masterEmail.trim().toLowerCase() || phone.trim() !== masterPhone.trim()) {
    return res.status(401).json({ message: 'Verification details do not match' });
  }

  // Generate 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Save to DB (overwrites old OTP for this email)
    await OTP.findOneAndUpdate(
      { email: email.toLowerCase() },
      { otp: otpCode, createdAt: new Date() },
      { upsert: true }
    );

    // Send Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Portfolio Admin OTP',
      text: `Your OTP for password reset is: ${otpCode}. It expires in 5 minutes.`,
      html: `<h3>Portfolio Admin Recovery</h3><p>Your OTP is: <b style="font-size: 24px; color: #22d3ee;">${otpCode}</b></p><p>This code expires in 5 minutes.</p>`
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP ${otpCode} sent to ${email}`);

    res.json({ message: 'OTP sent to your email successfully.' });
  } catch (err) {
    console.error('❌ OTP Error:', err.message);
    res.status(500).json({ message: 'Failed to send OTP. Check your email configuration.' });
  }
});

// POST /api/auth/verify-otp — Verify OTP and reset password
router.post('/verify-otp', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const record = await OTP.findOne({ email: email.toLowerCase(), otp });
    if (!record) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }

    const hash = await bcrypt.hash(newPassword, 12);
    await Settings.findOneAndUpdate(
      { key: 'admin_password_hash' },
      { key: 'admin_password_hash', value: hash },
      { upsert: true }
    );

    // Delete OTP after successful use
    await OTP.deleteOne({ _id: record._id });

    res.json({ message: 'Password reset successful! You can now login.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during verification' });
  }
});

module.exports = router;
