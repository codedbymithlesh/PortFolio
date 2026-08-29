const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Settings = require('../models/Settings');
const OTP = require('../models/OTP');
const asyncHandler = require('../utils/asyncHandler');
const { generateOTP, saveOTP, verifyOTP, deleteOTP } = require('../services/otpService');
const { sendOTP } = require('../services/emailService');

async function verifyPassword(plain) {
  const setting = await Settings.findOne({ key: 'admin_password_hash' });
  if (setting) {
    return bcrypt.compare(plain.trim(), setting.value);
  }
  return plain.trim() === (process.env.ADMIN_PASSWORD || '').trim();
}

const login = asyncHandler(async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ message: 'Password is required' });

  const ok = await verifyPassword(password);
  if (!ok) return res.status(401).json({ message: 'Invalid password' });

  const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, message: 'Login successful' });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Both current and new password are required' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'New password must be at least 8 characters' });
  }

  const ok = await verifyPassword(currentPassword);
  if (!ok) return res.status(401).json({ message: 'Current password is incorrect' });

  const hash = await bcrypt.hash(newPassword, 12);
  await Settings.findOneAndUpdate(
    { key: 'admin_password_hash' },
    { key: 'admin_password_hash', value: hash },
    { upsert: true, new: true }
  );
  res.json({ message: 'Password changed successfully' });
});

const requestOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const masterEmail = process.env.RECOVERY_EMAIL;
  if (!masterEmail) {
    return res.status(500).json({ message: 'Recovery email not configured in .env' });
  }
  if (email.trim().toLowerCase() !== masterEmail.trim().toLowerCase()) {
    return res.status(401).json({ message: 'Verification details do not match' });
  }

  const otpCode = generateOTP();
  await saveOTP(email, otpCode);
  await sendOTP(email, otpCode);

  res.json({ message: 'OTP sent to your email successfully.' });
});

const verifyOTPReset = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const record = await verifyOTP(email, otp);
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

  await deleteOTP(email, otp);
  res.json({ message: 'Password reset successful! You can now login.' });
});

module.exports = { login, changePassword, requestOTP, verifyOTPReset };
