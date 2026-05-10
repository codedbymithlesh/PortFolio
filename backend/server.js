// DNS configuration for local development issues
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

const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');
const uploadRoutes = require('./routes/upload');
const messagesRoutes = require('./routes/messages');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ 
  origin: true, // This allows any origin that makes the request, compatible with credentials
  credentials: true
}));
app.use(express.json());

// --- 🛠️ THE VERCEL FIX: Serverless DB Connection ---
let cachedDb = null;

const connectDB = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) return;

  console.log('🔄 Connecting to MongoDB...');
  console.log('Connecting to MongoDB...');
  try {
    const mongoOpts = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };
    cachedDb = await mongoose.connect(process.env.MONGO_URL, mongoOpts);
    console.log('MongoDB Connected!');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
};

// Middleware to ensure DB is connected
app.use(async (req, res, next) => {
  await connectDB();
  next();
});
// --------------------------------------------------

// Ensure uploads folder exists (Read-only on Vercel, but prevents crashes)
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

// Health check
app.get('/', (req, res) => res.json({ 
  status: 'Portfolio API running',
  environment: process.env.NODE_ENV || 'development',
  mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
}));

// Start server only if not in production (Vercel handles the export)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;