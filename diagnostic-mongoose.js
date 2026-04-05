const mongoose = require('mongoose');

// The standard connection string from your diagnostic.js
const MONGO_URI = "mongodb+srv://Madhura:monGO%401stBeauty@cluster0.f0divln.mongodb.net/BeautyInBalance?retryWrites=true&w=majority";

console.log('--- MONGOOSE CONNECTION TEST ---');
console.log('Attempting to connect to Atlas...');

mongoose.connect(MONGO_URI, {
    family: 4,
    tlsAllowInvalidCertificates: true,
    serverSelectionTimeoutMS: 10000
})
  .then(() => {
      console.log('✅ SUCCESS: Connected to MongoDB Atlas!');
      process.exit(0);
  })
  .catch((err) => {
      console.error('❌ FAILED: Could not connect to Atlas.');
      console.error('Error:', err.message);
      process.exit(1);
  });
