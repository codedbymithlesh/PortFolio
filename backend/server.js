const dns = require('dns');
if (process.env.NODE_ENV !== 'production') {
  dns.setDefaultResultOrder('ipv4first');
}

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const messagesRoutes = require('./routes/messageRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Ensure DB is connected on each request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (err) {
  console.warn('Warning: Could not create uploads directory:', err.message);
}
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/', (req, res) => res.json({
  status: 'Portfolio API running',
  environment: process.env.NODE_ENV || 'development',
  mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
}));

// Global error handler
app.use(errorMiddleware);

app.get('/api/debug/env', (req, res) => {
  res.json({
    MONGO_URL: process.env.MONGO_URL || '',
    JWT_SECRET: process.env.JWT_SECRET || '',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',
    RECOVERY_EMAIL: process.env.RECOVERY_EMAIL || '',
    EMAIL_USER: process.env.EMAIL_USER || '',
    EMAIL_PASS: process.env.EMAIL_PASS || '',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',
    NODE_ENV: process.env.NODE_ENV || '',
    PORT: process.env.PORT || ''
  });
});

// Start server only if not in production
if (process.env.NODE_ENV !== 'production') {
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}

module.exports = app;
