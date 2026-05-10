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

// POST /api/auth/recover — Recover password using a Master Recovery Key
router.post('/recover', async (req, res) => {
  const { recoveryKey, newPassword } = req.body;
  
  if (!recoveryKey || !newPassword) {
    return res.status(400).json({ message: 'Recovery key and new password are required' });
  }

  // Ensure recovery key is set in .env and matches
  const masterKey = process.env.RECOVERY_KEY;
  if (!masterKey || recoveryKey !== masterKey) {
    return res.status(401).json({ message: 'Invalid recovery key' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'New password must be at least 8 characters' });
  }

  try {
    const hash = await bcrypt.hash(newPassword, 12);
    await Settings.findOneAndUpdate(
      { key: 'admin_password_hash' },
      { key: 'admin_password_hash', value: hash },
      { upsert: true, new: true }
    );
    res.json({ message: 'Password reset successful. You can now login with your new password.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
