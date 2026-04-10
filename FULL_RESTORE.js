require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const fullBackup = require('./ALL_PRODUCTS_RECOVERY'); // The Node-compatible backup file

async function restoreFull() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { 
            family: 4,
            serverSelectionTimeoutMS: 15000 
        });
        console.log('Connected to DB for Full Restoration...');

        console.log('🗑️  Clearing current partial data...');
        await Product.deleteMany({});
        
        console.log(`📤  Restoring ${fullBackup.length} products from products.js...`);
        const result = await Product.insertMany(fullBackup.map(p => ({
            ...p,
            stock: p.stock || 50,
            discount: p.discount || 0
        })));
        
        console.log(`✅ SUCCESS! Restored ${result.length} products total.`);
        process.exit(0);
    } catch (err) {
        console.error('RESTORE ERROR:', err.message);
        process.exit(1);
    }
}

restoreFull();
