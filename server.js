require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.set('trust proxy', true);
const PORT = process.env.PORT || 5000;

// Default MongoDB URIs for active cluster (cluster0.cdk8tzx.mongodb.net)
const MONGO_URIS_TO_TRY = [
    "mongodb+srv://newbeauty:admin1234@cluster0.cdk8tzx.mongodb.net/BeautyInBalance?retryWrites=true&w=majority",
    process.env.MONGO_URI,
    "mongodb+srv://nipunibeauty:admin1234@cluster0.cdk8tzx.mongodb.net/BeautyInBalance?retryWrites=true&w=majority",
    "mongodb+srv://nipunibeauty:BeautyAdmin%402026@cluster0.cdk8tzx.mongodb.net/BeautyInBalance?retryWrites=true&w=majority"
].filter(Boolean);

// Database Connection Logic
let isConnecting = false;
const connectDB = async () => {
    if (mongoose.connection.readyState === 1) return;
    if (isConnecting) return;
    
    isConnecting = true;
    for (const rawURI of MONGO_URIS_TO_TRY) {
        const cleanURI = rawURI.trim().replace(/^"(.*)"$/, '$1');
        try {
            await mongoose.connect(cleanURI, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                connectTimeoutMS: 5000,
                family: 4 // Force IPv4 for Render compatibility
            });
            console.log('✅ MongoDB connection successful!');
            isConnecting = false;
            return;
        } catch (err) {
            console.warn(`[DB Connection Attempt] Failed for URI: ${err.message}`);
        }
    }
    console.error('❌ All MongoDB connection attempts failed!');
    isConnecting = false;
};
connectDB();

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB connection lost. Attempting reconnect...');
    setTimeout(connectDB, 3000);
});
mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error event:', err.message);
});

// Middlewares
app.use(cors({
    origin: '*', // Dynamic origin allowance
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma']
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Express Middleware: Ensure DB is connected before processing API requests
app.use(async (req, res, next) => {
    if (req.path.startsWith('/api') && mongoose.connection.readyState !== 1) {
        console.warn(`[DB Middleware] MongoDB state is ${mongoose.connection.readyState}. Connecting...`);
        await connectDB();
    }
    next();
});

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
const brandRoutes = require('./routes/brandRoutes');

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/slides', slideRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/brands', brandRoutes);

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
// Prevent browser caching of HTML files so they always get the latest version tags
app.use(express.static(path.join(__dirname, '.'), {
    setHeaders: (res, filepath) => {
        if (filepath.endsWith('.html') || filepath.endsWith('products.js')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
        }
    }
}));

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
