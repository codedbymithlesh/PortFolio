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
  origin: process.env.FRONTEND_URL || true, 
  credentials: true
}));
app.use(express.json({ limit: '10kb' })); // Limit body size to prevent DoS

// Security Headers (Basic Helmet implementation)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  res.disable('x-powered-by'); // Prevent fingerprinting
  next();
});

// Simple Rate Limiter
const loginAttempts = new Map();
const rateLimit = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const limit = 100; // 100 requests
  const windowMs = 15 * 60 * 1000; // 15 minutes

  if (!loginAttempts.has(ip)) {
    loginAttempts.set(ip, { count: 1, firstRequest: now });
    return next();
  }

  const data = loginAttempts.get(ip);
  if (now - data.firstRequest > windowMs) {
    loginAttempts.set(ip, { count: 1, firstRequest: now });
    return next();
  }

  data.count++;
  if (data.count > limit) {
    return res.status(429).json({ message: 'Too many requests, please try again later.' });
  }
  next();
};

// Apply rate limiting to sensitive routes
app.use('/api/auth/login', rateLimit);
app.use('/api/messages', rateLimit);

// --- 🛠️ THE VERCEL FIX: Serverless DB Connection ---
let cachedDb = null;

const connectDB = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) return;

  try {
    const mongoOpts = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };
    cachedDb = await mongoose.connect(process.env.MONGO_URL, mongoOpts);
  } catch (err) {
    // Avoid logging sensitive connection strings
    console.error('Database connection failed');
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
  // Silent fail in production
}
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/messages', messagesRoutes);

// Health check (Sanitized)
app.get('/', (req, res) => res.json({ 
  status: 'active',
  timestamp: new Date().toISOString()
}));

// Start server only if not in production (Vercel handles the export)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;