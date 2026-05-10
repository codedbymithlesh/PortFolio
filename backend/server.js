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

// Ensure uploads folder exists (with try-catch for serverless read-only filesystem)
const uploadsDir = path.join(__dirname, 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (err) {
  console.warn('⚠️ Warning: Could not create uploads directory:', err.message);
}

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'];

app.use(cors({ 
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1 && process.env.NODE_ENV === 'production') {
      // In production, be strict. In dev, maybe less so.
      // But for now, keeping it as is but adding a check.
      return callback(null, true); // Temporarily allow all for debugging if needed, or keep strict
    }
    return callback(null, true); 
  },
  credentials: true
}));

// More robust CORS for Vercel
app.use(cors()); 

app.use(express.json());

// Serve uploaded images as static files
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/messages', messagesRoutes);

// Health check
app.get('/', (req, res) => res.json({ 
  status: 'Portfolio API running 🚀',
  environment: process.env.NODE_ENV || 'development',
  mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
}));

// Connect to MongoDB
const mongoOpts = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

mongoose
  .connect(process.env.MONGO_URI, mongoOpts)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

// Start server only if not in production (Vercel handles the export)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
}

module.exports = app;
