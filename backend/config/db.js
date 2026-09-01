const mongoose = require('mongoose');

const connectDB = async () => {
  const state = mongoose.connection.readyState;
  // 0 = disconnected, 2 = connecting — only skip if fully connected (1)
  if (state === 1) return;

  console.log('Connecting to MongoDB...');
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 3000,
    });
    console.log('MongoDB Connected!');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected, will reconnect on next request...');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err.message);
});

module.exports = connectDB;
