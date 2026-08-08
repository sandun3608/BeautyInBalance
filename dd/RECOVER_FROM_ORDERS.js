require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order');

async function recoverFromOrders() {
    try {
        await mongoose.connect(process.env.MONGO_URI, { family: 4 });
        console.log('Connected to DB for Order Recovery...');

        const orders = await Order.find({}).sort({ createdAt: -1 });
        console.log(`Found ${orders.length} orders.`);

        const recoveredProducts = new Map();

        orders.forEach(order => {
            order.items.forEach(item => {
                if (!recoveredProducts.has(item.name)) {
                    recoveredProducts.set(item.name, {
                        name: item.name,
                        price: item.price,
                        id: item.productId || item.id
                    });
                }
            });
        });

        console.log('\n--- RECOVERED PRODUCT DATA ---');
        console.log(Array.from(recoveredProducts.values()));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

recoverFromOrders();
