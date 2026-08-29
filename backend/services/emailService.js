const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendEmail = async (options) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('Email credentials not set. Skipping email notification.');
    return;
  }

  const mailOptions = {
    from: `"Portfolio Notification" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: options.subject,
    html: options.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const sendOTP = async (email, otpCode) => {
  const transporter = createTransporter();
  if (!transporter) {
    throw new Error('Email credentials not configured');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Portfolio Admin OTP',
    text: `Your OTP for password reset is: ${otpCode}. It expires in 5 minutes.`,
    html: `<h3>Portfolio Admin Recovery</h3><p>Your OTP is: <b style="font-size: 24px; color: #22d3ee;">${otpCode}</b></p><p>This code expires in 5 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`OTP ${otpCode} sent to ${email}`);
};

module.exports = { sendEmail, sendOTP };
