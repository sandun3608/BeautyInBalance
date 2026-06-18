require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('../models/Order');

const run = async () => {
    const mongoURI = process.env.MONGO_URI;
    const cleanURI = mongoURI.trim().replace(/^"(.*)"$/, '$1');

    try {
        await mongoose.connect(cleanURI);
        console.log('✅ Connected to MongoDB');
        
        const latestOrder = await Order.findOne().sort({ createdAt: -1 });
        if (latestOrder) {
            console.log('Latest Order Details:', JSON.stringify(latestOrder, null, 2));
        } else {
            console.log('No orders found.');
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
};

run();
