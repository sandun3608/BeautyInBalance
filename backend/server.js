require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in environment variables!");
} else {
  // Try cleaning up the URI if it contains hidden characters or extra quotes from .env
  const cleanURI = mongoURI.trim().replace(/^"(.*)"$/, '$1');
  
  mongoose.connect(cleanURI, {
    family: 4, // Force IPv4 to avoid potential local IPv6 issues
    serverSelectionTimeoutMS: 15000, // Wait longer for initial connect
    connectTimeoutMS: 15000,
  })
    .then(() => console.log('✅ MongoDB connection successful!'))
    .catch((err) => {
      console.error('❌ MongoDB connection error: ', err.message);
      console.error('Stack Trace:', err.stack);
    });
}

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
