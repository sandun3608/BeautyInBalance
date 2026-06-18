require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');

async function check() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI, { family: 4 });
        console.log('Connected!');

        const products = await Product.find({});
        const productNames = new Set(products.map(p => p.name.trim().toLowerCase()));

        console.log(`Current products in DB: ${products.length}`);

        const orders = await Order.find({});
        console.log(`Total orders in DB: ${orders.length}`);

        const missingProductsFromOrders = [];

        orders.forEach(order => {
            if (order.orderItems) {
                order.orderItems.forEach(item => {
                    const name = item.name.trim();
                    if (!productNames.has(name.toLowerCase())) {
                        missingProductsFromOrders.push({
                            name: name,
                            price: item.price,
                            qty: item.qty,
                            image: item.image,
                            orderId: order._id,
                            customer: order.customerInfo ? `${order.customerInfo.firstName} ${order.customerInfo.lastName}` : 'Unknown'
                        });
                    }
                });
            }
        });

        if (missingProductsFromOrders.length > 0) {
            console.log('\n🔍 Found missing products in orders:');
            console.log(missingProductsFromOrders);
        } else {
            console.log('\n✅ No missing products found in orders.');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
