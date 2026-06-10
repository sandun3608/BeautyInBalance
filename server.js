require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.set('trust proxy', true);
const PORT = process.env.PORT || 5000;

// Database Connection Logic
const connectDB = async () => {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
        console.error("FATAL ERROR: MONGO_URI is missing from environment variables!");
        return;
    }
    
    // Cleanup the URI format just in case
    const cleanURI = mongoURI.trim().replace(/^"(.*)"$/, '$1');

    try {
        await mongoose.connect(cleanURI, {
            family: 4,
            serverSelectionTimeoutMS: 15000,
            connectTimeoutMS: 15000
        });
        console.log('✅ MongoDB connection successful!');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
    }
};
connectDB();

// Middlewares
app.use(cors({
    origin: '*', // Dynamic origin allowance
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Serve API Routes (from root routes/ folder)
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const statsRoutes = require('./routes/statsRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const slideRoutes = require('./routes/slideRoutes');
const subscriberRoutes = require('./routes/subscriberRoutes');

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/slides', slideRoutes);
app.use('/api/subscribers', subscriberRoutes);

// Health Check API
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'online', 
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        time: new Date()
    });
});

// Maintenance Mode Middleware
const fs = require('fs');
app.use((req, res, next) => {
    const maintenanceFile = path.join(__dirname, 'MAINTENANCE_MODE.lock');
    const isMaintenance = process.env.MAINTENANCE_MODE === 'true' || fs.existsSync(maintenanceFile);

    if (isMaintenance) {
        // Allow access to maintenance page, admin pages, and static assets
        const allowedPaths = [
            '/maintenance.html',
            '/admin.html',
            '/dashboard.html',
            '/login.html',
            '/api/users/login'
        ];

        // Identify if it's a static asset (has a file extension and not .html)
        const isStaticAsset = req.path.includes('.') && !req.path.endsWith('.html');
        const isAllowed = allowedPaths.some(p => req.path.startsWith(p)) || isStaticAsset;

        if (!isAllowed && !req.path.startsWith('/api')) {
            return res.sendFile(path.join(__dirname, 'maintenance.html'));
        }
    }
    next();
});

// IMPORTANT: Serve static files from the ROOT directory
// This allows the same Render service to host both HTML frontend and the Node API
app.use(express.static(path.join(__dirname, '.')));

// Fallback for SPA-like navigation: Send index.html for all non-API GET requests
app.get('*', (req, res, next) => {
    // If it's an API request, let it fall through to a 404 (handled by default)
    if (req.path.startsWith('/api')) {
        return next();
    }
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Unified server running on port ${PORT}`);
    console.log(`API BASE Path: /api`);
    console.log(`Static Site Path: / (Serving root directory)`);
});
