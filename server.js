require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Force IPv4 for Atlas Connectivity 
mongoose.set('bufferCommands', false);

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) throw new Error('MONGO_URI missing in .env');
        
        console.log('--- DB CONNECTION ATTEMPT ---');
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
            family: 4 
        });
        console.log('✅ DATABASE CONNECTED SUCCESSFULLY');
    } catch (err) {
        console.error('❌ MONGODB ERROR:', err.message);
        console.log('HINT: Add 0.0.0.0/0 to your MongoDB Atlas IP Whitelist.');
    }
};

connectDB();

app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
app.use(express.json({ limit: '50mb' })); // Increased limit for HQ images
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Status API
app.get('/api/status', (req, res) => {
    res.json({ 
        online: true, 
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        env: process.env.NODE_ENV || 'development'
    });
});

// Import Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

// Static Frontend
app.use(express.static(path.join(__dirname, '.')));

app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SERVER LIVE: http://localhost:${PORT}`);
});
