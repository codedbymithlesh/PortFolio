require('dotenv').config();
const mongoose = require('mongoose');
console.log('Testing connection to:', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)
  .then(() => { console.log('✅ Connected OK'); process.exit(0); })
  .catch((e) => { console.error('❌ Error:', e.message); process.exit(1); });
