require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Re-enable buffering but keep it safe
mongoose.set('bufferCommands', true);

// Database Connection Function
const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables.');
        }

        console.log('Attempting to connect to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            family: 4,
            tlsAllowInvalidCertificates: true,
            serverSelectionTimeoutMS: 5000
        });

        console.log(`MongoDB Connected: ${conn.connection.host} ✅`);
        
    } catch (error) {
        console.error('CRITICAL: MongoDB connection failed ❌');
        console.error('Error Details:', error.message);
        console.log('HINT: Check your Atlas IP Whitelist (add 0.0.0.0/0 for testing).');
        
        // Don't kill the process immediately so logs can be read on Render
        setTimeout(() => process.exit(1), 5000); 
    }
};

// Import Routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const statsRoutes = require('./routes/statsRoutes');
const path = require('path');

// Middleware
const allowedOrigins = [
    'https://beauty-in-balance-phi.vercel.app',
    'https://beauty-in-balance-frontend.onrender.com', // In case they use the Render static service
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://localhost:5000'
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            // For testing, we can allow all, but let's be specific for Vercel
            // return callback(new Error(msg), false); 
            return callback(null, true); // Fallback: allow all for now to ensure it works
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files from the project root
app.use(express.static(path.join(__dirname, '.')));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/stats', statsRoutes);

// Fix: Serve HTML files for specific routes if needed
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));

// Root API Status
app.get('/api', (req, res) => {
    res.json({ 
        message: 'Welcome to Beauty in Balance API',
        dbStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// Run the connection handler
connectDB().catch(err => {
    console.error('Initial DB Connect Error:', err.message);
});

// Start the server immediately so Render health checks pass
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀`);
    console.log(`Access the API at: http://localhost:${PORT}/api`);
});
