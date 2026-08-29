const Message = require('../models/Message');
const asyncHandler = require('../utils/asyncHandler');
const { sendEmail } = require('../services/emailService');

const sendMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email and message are required' });
  }

  await Message.create({ name, email, subject: subject || 'General Inquiry', message });

  await sendEmail({
    subject: `New Portfolio Message: ${subject || 'General Inquiry'}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #DC2626; border-bottom: 2px solid #DC2626; padding-bottom: 10px;">New Message Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 10px;">
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;" />
        <p style="font-size: 0.8rem; color: #666;">This message was sent from your Portfolio Contact Form.</p>
      </div>
    `,
  });

  res.status(201).json({ message: 'Message sent successfully!' });
});

const getMessages = asyncHandler(async (req, res) => {
  const msgs = await Message.find().sort({ createdAt: -1 });
  res.json(msgs);
});

const markAsRead = asyncHandler(async (req, res) => {
  await Message.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ message: 'Marked as read' });
});

const deleteMessage = asyncHandler(async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = { sendMessage, getMessages, markAsRead, deleteMessage };
