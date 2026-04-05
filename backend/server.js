require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Improve Debugging: Fail fast instead of buffering for 10 seconds
mongoose.set('bufferCommands', false);

// Check if MONGO_URI is missing
if (!process.env.MONGO_URI) {
    console.warn('WARNING: process.env.MONGO_URI is not defined! Ensure it is set in your .env or Render dashboard.');
} else {
    console.log('MONGO_URI found, attempting connection...');
}

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/beautyInBalance', {
  family: 4,
  tlsAllowInvalidCertificates: true,
  serverSelectionTimeoutMS: 5000
})
  .then(() => console.log('MongoDB connection successful! ✅'))
  .catch((err) => {
      console.error('CRITICAL: MongoDB connection error ❌');
      console.error('Details:', err.message);
      console.log('HINT: Check your Atlas IP Whitelist (add 0.0.0.0/0 for testing).');
  });

// Import Routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const statsRoutes = require('./routes/statsRoutes');

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/stats', statsRoutes);

// Basic Route for Testing
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Beauty in Balance API' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
