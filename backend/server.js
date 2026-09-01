const dns = require('dns');
if (process.env.NODE_ENV !== 'production') {
  dns.setDefaultResultOrder('ipv4first');
}

require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Middleware to ensure DB is connected on each request (Vercel serverless)
const mongoose = require('mongoose');
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Start server only if not in production
if (process.env.NODE_ENV !== 'production') {
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}

module.exports = app;
