const mongoose = require('mongoose');

let connectPromise = null;

const connectDB = async () => {
  const state = mongoose.connection.readyState;
  if (state === 1) return;
  if (state === 2 && connectPromise) {
    await connectPromise;
    return;
  }

  console.log('Connecting to MongoDB...');
  connectPromise = mongoose.connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 3000,
  });

  try {
    await connectPromise;
    console.log('MongoDB Connected!');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    connectPromise = null;
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected, will reconnect on next request...');
  connectPromise = null;
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err.message);
});

module.exports = connectDB;
