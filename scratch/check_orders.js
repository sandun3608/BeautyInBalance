require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('../models/Order');

console.log("Connecting to database:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    console.log("✅ Database connected!");
    const orders = await Order.find().sort({ createdAt: -1 }).limit(5);
    console.log(`\nFound ${orders.length} recent orders:`);
    orders.forEach(o => {
        console.log(`- ID: ${o._id}`);
        console.log(`  Date: ${o.createdAt}`);
        console.log(`  Customer: ${o.customerInfo?.firstName} ${o.customerInfo?.lastName}`);
        console.log(`  Phone: ${o.customerInfo?.phone}`);
        console.log(`  Method: ${o.paymentMethod}`);
        console.log(`  Total: ${o.totalPrice}`);
        console.log(`  Paid: ${o.isPaid}`);
        console.log(`  Items:`, o.orderItems.map(i => `${i.qty}x ${i.name}`).join(', '));
        console.log('----------------------------');
    });
    process.exit(0);
})
.catch(err => {
    console.error("❌ DB Connection failed:", err);
    process.exit(1);
});
