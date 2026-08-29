const OTP = require('../models/OTP');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const saveOTP = async (email, otpCode) => {
  await OTP.findOneAndUpdate(
    { email: email.toLowerCase() },
    { otp: otpCode, createdAt: new Date() },
    { upsert: true }
  );
};

const verifyOTP = async (email, otp) => {
  const record = await OTP.findOne({ email: email.toLowerCase(), otp });
  return record;
};

const deleteOTP = async (email, otp) => {
  await OTP.deleteOne({ email: email.toLowerCase(), otp });
};

module.exports = { generateOTP, saveOTP, verifyOTP, deleteOTP };
