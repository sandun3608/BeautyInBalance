const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create new order in the database (Open to Guests)
// @access  Public
router.post('/', async (req, res) => {
    const {
        user, // Optional user ID for logged-in users
        customerInfo,
        orderItems,
        shippingPrice,
        paymentMethod,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No order items found' });
        return;
    } 

    try {
        const order = new Order({
            user: user || null,
            customerInfo,
            orderItems,
            shippingPrice,
            paymentMethod,
            totalPrice
        });

        const createdOrder = await order.save();

        // --- EMAIL NOTIFICATIONS (BACKGROUND) ---
        if (process.env.EMAIL_USER && (process.env.GOOGLE_CLIENT_ID || process.env.EMAIL_PASS)) {
            const sendEmail = require('../utils/mailer');
            
            try {
                const itemsList = (createdOrder.orderItems || []).map(i => `<li>${i.qty}x ${i.name} - Rs. ${i.price.toLocaleString()}</li>`).join('');
                const customerName = `${createdOrder.customerInfo?.firstName || 'Customer'} ${createdOrder.customerInfo?.lastName || ''}`;

                // 1. Notify Admin (Background)
                sendEmail({
                    email: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
                    subject: `🛍️ New Order Received! #${createdOrder._id.toString().slice(-6).toUpperCase()}`,
                    html: `
                        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                            <h2 style="color: #b58646;">New Order Notification</h2>
                            <p>You have received a new order from <strong>${customerName}</strong>.</p>
                            <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Details</h3>
                            <ul>${itemsList}</ul>
                            <p><strong>Total Price:</strong> Rs. ${createdOrder.totalPrice.toLocaleString()}</p>
                            <p><strong>Payment Method:</strong> ${createdOrder.paymentMethod}</p>
                            <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">Customer Contact</h3>
                            <p><strong>Email:</strong> ${createdOrder.customerInfo.email}</p>
                            <p><strong>Phone:</strong> ${createdOrder.customerInfo.phone}</p>
                            <p><strong>Address:</strong> ${createdOrder.customerInfo.address}, ${createdOrder.customerInfo.city}</p>
                        </div>
                    `
                }).then(() => console.log(`📧 Admin notified for order ${createdOrder._id}`)).catch(err => console.error("📧 Admin email error:", err));

                // 2. Notify Customer (Background)
                sendEmail({
                    email: createdOrder.customerInfo.email,
                    subject: `Confirmation: Your Beauty in Balance Order #${createdOrder._id.toString().slice(-6).toUpperCase()}`,
                    html: `
                        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px; margin: 0 auto;">
                            <h1 style="color: #b58646; text-align: center;">Thank You for Your Order!</h1>
                            <p>Hi ${createdOrder.customerInfo.firstName},</p>
                            <p>We've received your order and are getting it ready for shipment.</p>
                            <div style="background: #fdfbf7; padding: 20px; border-radius: 10px; margin: 20px 0;">
                                <h3 style="margin-top: 0; color: #1b1b1e;">Order Summary</h3>
                                <ul style="list-style: none; padding: 0;">
                                    ${(createdOrder.orderItems || []).map(i => `
                                        <li style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                                            <span>${i.qty}x ${i.name}</span>
                                            <span style="font-weight: bold;">Rs. ${(i.price * i.qty).toLocaleString()}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                                <div style="display: flex; justify-content: space-between; padding-top: 15px; font-weight: bold; font-size: 18px;">
                                    <span>Total</span>
                                    <span style="color: #b58646;">Rs. ${createdOrder.totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    `
                }).then(() => console.log(`📧 Customer notified for order ${createdOrder._id}`)).catch(err => console.error("📧 Customer email error:", err));
            } catch (emailBuildErr) {
                console.error("❌ Failed to build order email:", emailBuildErr);
            }
        }

        // --- WHATSAPP NOTIFICATIONS (Green API / UltraMsg / CallMeBot) ---
        const rawWpPhone = process.env.WHATSAPP_PHONE;
        const wpPhone = rawWpPhone ? rawWpPhone.replace(/[^0-9]/g, '') : null;
        const greenApiId = process.env.GREEN_API_ID_INSTANCE;
        const greenApiToken = process.env.GREEN_API_TOKEN_INSTANCE;
        const ultraMsgInstance = process.env.ULTRAMSG_INSTANCE_ID;
        const ultraMsgToken = process.env.ULTRAMSG_TOKEN;
        const wpApiKey = process.env.WHATSAPP_API_KEY;

        const isOnlinePayment = ['Koko', 'Card Payment'].includes(createdOrder.paymentMethod);
        if (wpPhone && (!isOnlinePayment || createdOrder.isPaid)) {
            const axios = require('axios');
            const customerName = `${createdOrder.customerInfo?.firstName || 'Customer'} ${createdOrder.customerInfo?.lastName || ''}`;
            const orderIdShort = createdOrder._id.toString().slice(-6).toUpperCase();
            
            let wpMessage = `*🚨 New Order Placed! #${orderIdShort}*\n\n` +
                            `*Customer:* ${customerName}\n` +
                            `*Total:* Rs. ${createdOrder.totalPrice.toLocaleString()}\n` +
                            `*Payment:* ${createdOrder.paymentMethod}\n` +
                            `*Phone:* ${createdOrder.customerInfo?.phone || 'N/A'}\n` +
                            `*City:* ${createdOrder.customerInfo?.city || 'N/A'}\n\n` +
                            `Check details: https://www.beautyinbalance.lk/admin`;

            // Option A: Green API Integration
            if (greenApiId && greenApiToken) {
                const url = `https://api.green-api.com/waInstance${greenApiId}/sendMessage/${greenApiToken}`;
                axios.post(url, {
                    chatId: `${wpPhone}@c.us`,
                    message: wpMessage
                })
                .then(() => console.log(`💬 Green API WhatsApp notification sent for order ${createdOrder._id}`))
                .catch(err => console.error("❌ Green API notification failed:", err.message));
            }
            // Option B: UltraMsg Integration
            else if (ultraMsgInstance && ultraMsgToken) {
                const url = `https://api.ultramsg.com/${ultraMsgInstance}/messages/chat`;
                axios.post(url, {
                    token: ultraMsgToken,
                    to: wpPhone,
                    body: wpMessage
                })
                .then(() => console.log(`💬 UltraMsg WhatsApp notification sent for order ${createdOrder._id}`))
                .catch(err => console.error("❌ UltraMsg notification failed:", err.message));
            }
            // Option C: CallMeBot Integration (Fallback)
            else if (wpApiKey) {
                const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(wpPhone)}&text=${encodeURIComponent(wpMessage)}&apikey=${encodeURIComponent(wpApiKey)}`;
                axios.get(url)
                    .then(() => console.log(`💬 CallMeBot WhatsApp notification sent for order ${createdOrder._id}`))
                    .catch(err => console.error("❌ CallMeBot notification failed:", err.message));
            }
        }

        // --- CUSTOMER WHATSAPP NOTIFICATION (ORDER PLACED) ---
        if (!isOnlinePayment || createdOrder.isPaid) {
            sendCustomerWhatsAppNotification(createdOrder, 'placed');
            reduceProductStock(createdOrder);
        }

        return res.status(201).json(createdOrder);
    } catch (error) {
        console.error("Order Creation Error:", error);
        return res.status(500).json({ message: 'Failed to create order on server' });
    }
});

// @route   GET /api/orders
// @desc    Get all orders for the Admin Dashboard
// @access  Private (Admins Only)
router.get('/', protect, async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [
                { paymentMethod: { $nin: ['Koko', 'Card Payment'] } },
                { paymentMethod: { $in: ['Koko', 'Card Payment'] }, isPaid: true }
            ]
        }).sort({ createdAt: -1 }); // Newest first
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error("Error fetching my orders:", error);
        res.status(500).json({ message: 'Failed to fetch your orders' });
    }
});

// @route   PUT /api/orders/:id/deliver
// @desc    Update order to delivered
// @access  Private
router.put('/:id/deliver', protect, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Order ID format' });
        }

        const order = await Order.findById(req.params.id);
        if (order) {
            order.isDelivered = true;
            const updatedOrder = await order.save();
            sendCustomerWhatsAppNotification(updatedOrder, 'delivered');
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error("Order Delivery Error:", error);
        res.status(500).json({ message: 'Server error updating order' });
    }
});

// @route   DELETE /api/orders/:id
// @desc    Delete an order
// @access  Private (Admins Only)
router.delete('/:id', protect, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Order ID format' });
        }
        const order = await Order.findById(req.params.id);
        if (order) {
            await Order.findByIdAndDelete(req.params.id);
            res.json({ message: 'Order removed successfully' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error("Order Delete Error:", error);
        res.status(500).json({ message: 'Server error deleting order' });
    }
});


// @route   GET /api/orders/test-email
// @desc    Test email configuration
// @access  Public
router.get('/test-email', async (req, res) => {
    try {
        const sendEmail = require('../utils/mailer');
        await sendEmail({
            email: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
            subject: '🔔 BiB Server: Email Test',
            html: '<h1>System Test</h1><p>If you see this, your email configuration is working perfectly!</p>'
        });
        res.json({ message: 'Test email sent successfully! Check your inbox.' });
    } catch (err) {
        console.error("❌ Email Test Failed:", err);
        res.status(500).json({ 
            message: 'Email test failed', 
            error: err.message,
            tip: 'Ensure 2-Step Verification is ON and you are using a valid App Password.'
        });
    }
});

// Helper function to format Sri Lankan phone numbers for WhatsApp
const formatWhatsAppPhone = (phone) => {
    if (!phone) return null;
    let cleaned = phone.replace(/[^0-9+]/g, '');
    if (cleaned.startsWith('+')) {
        cleaned = cleaned.substring(1);
    }
    if (cleaned.startsWith('0')) {
        cleaned = '94' + cleaned.substring(1);
    }
    if (cleaned.length === 9 && !cleaned.startsWith('94')) {
        cleaned = '94' + cleaned;
    }
    return cleaned;
};

// Helper function to send WhatsApp messages to customers
const sendCustomerWhatsAppNotification = async (order, type) => {
    try {
        const greenApiId = process.env.GREEN_API_ID_INSTANCE;
        const greenApiToken = process.env.GREEN_API_TOKEN_INSTANCE;
        const ultraMsgInstance = process.env.ULTRAMSG_INSTANCE_ID;
        const ultraMsgToken = process.env.ULTRAMSG_TOKEN;
        const wpApiKey = process.env.WHATSAPP_API_KEY;

        const rawPhone = order.customerInfo?.phone;
        const customerPhone = formatWhatsAppPhone(rawPhone);
        if (!customerPhone) return;

        const customerName = order.customerInfo?.firstName || 'Customer';
        const orderIdShort = order._id.toString().slice(-6).toUpperCase();

        let wpMessage = '';
        if (type === 'placed') {
            const itemsList = (order.orderItems || []).map(i => `- ${i.qty}x ${i.name}`).join('\n');
            wpMessage = `Hello ${customerName},\n\n` +
                        `Thank you for your order with *Beauty in Balance*! 🌸\n` +
                        `We have received your order *#${orderIdShort}* and it is now being processed.\n\n` +
                        `*Order Details:*\n` +
                        `${itemsList}\n\n` +
                        `*Total:* Rs. ${order.totalPrice.toLocaleString()}\n` +
                        `*Payment Method:* ${order.paymentMethod}\n\n` +
                        `We will notify you once your order is on the way. If you have any questions, feel free to reply to this message.\n\n` +
                        `Best regards,\n` +
                        `*Beauty in Balance*`;
        } else if (type === 'delivered') {
            wpMessage = `Hello ${customerName},\n\n` +
                        `Great news! Your *Beauty in Balance* order *#${orderIdShort}* has been successfully delivered. 🎉\n` +
                        `Thank you for shopping with us! We hope you love your products.\n\n` +
                        `Best regards,\n` +
                        `*Beauty in Balance*`;
        }

        // Option A: Green API Integration
        if (greenApiId && greenApiToken) {
            const url = `https://api.green-api.com/waInstance${greenApiId}/sendMessage/${greenApiToken}`;
            await axios.post(url, {
                chatId: `${customerPhone}@c.us`,
                message: wpMessage
            });
            console.log(`💬 WhatsApp notification sent to customer ${customerPhone} for order ${order._id} (${type})`);
        }
        // Option B: UltraMsg Integration
        else if (ultraMsgInstance && ultraMsgToken) {
            const url = `https://api.ultramsg.com/${ultraMsgInstance}/messages/chat`;
            await axios.post(url, {
                token: ultraMsgToken,
                to: customerPhone,
                body: wpMessage
            });
            console.log(`💬 WhatsApp notification sent to customer ${customerPhone} for order ${order._id} (${type})`);
        }
        // Option C: CallMeBot Integration (Fallback)
        else if (wpApiKey) {
            const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(customerPhone)}&text=${encodeURIComponent(wpMessage)}&apikey=${encodeURIComponent(wpApiKey)}`;
            await axios.get(url);
            console.log(`💬 WhatsApp notification sent to customer ${customerPhone} for order ${order._id} (${type})`);
        }
    } catch (err) {
        console.error("❌ WhatsApp notification to customer failed:", err.message);
    }
};

// Helper function to reduce product stock and send low stock alerts
const reduceProductStock = async (order) => {
    try {
        if (order.isStockReduced) {
            console.log(`Stock already reduced for order ${order._id}`);
            return;
        }

        const orderItems = order.orderItems || [];
        for (const item of orderItems) {
            if (item.product) {
                let product = null;
                // Find by ObjectId or custom id string
                if (mongoose.Types.ObjectId.isValid(item.product)) {
                    product = await Product.findById(item.product);
                }
                if (!product) {
                    product = await Product.findOne({ id: item.product });
                }
                if (!product) {
                    // Try by exact name match as fallback
                    product = await Product.findOne({ name: item.name });
                }

                if (product) {
                    const newStock = Math.max(0, (product.stock || 0) - (item.qty || 1));
                    product.stock = newStock;
                    await product.save();
                    console.log(`📉 Stock reduced for ${product.name} to ${newStock}`);

                    if (newStock <= 3) {
                        await sendLowStockAlert(product);
                    }
                }
            }
        }

        order.isStockReduced = true;
        await order.save();
    } catch (err) {
        console.error("❌ Failed to reduce stock:", err.message);
    }
};

// Helper function to send low stock alerts to Admin WhatsApp
const sendLowStockAlert = async (product) => {
    try {
        const wpPhone = process.env.WHATSAPP_PHONE;
        const greenApiId = process.env.GREEN_API_ID_INSTANCE;
        const greenApiToken = process.env.GREEN_API_TOKEN_INSTANCE;
        const ultraMsgInstance = process.env.ULTRAMSG_INSTANCE_ID;
        const ultraMsgToken = process.env.ULTRAMSG_TOKEN;
        const wpApiKey = process.env.WHATSAPP_API_KEY;

        if (!wpPhone) return;

        let wpMessage = `*⚠️ LOW STOCK ALERT! ⚠️*\n\n` +
                        `*Product:* ${product.name}\n` +
                        `*Remaining Stock:* ${product.stock}\n` +
                        `*Category:* ${product.cat}\n\n` +
                        `Please restock: https://www.beautyinbalance.lk/admin`;

        // Option A: Green API
        if (greenApiId && greenApiToken) {
            const url = `https://api.green-api.com/waInstance${greenApiId}/sendMessage/${greenApiToken}`;
            await axios.post(url, {
                chatId: `${wpPhone}@c.us`,
                message: wpMessage
            });
            console.log(`💬 Low Stock Alert sent for ${product.name}`);
        }
        // Option B: UltraMsg
        else if (ultraMsgInstance && ultraMsgToken) {
            const url = `https://api.ultramsg.com/${ultraMsgInstance}/messages/chat`;
            await axios.post(url, {
                token: ultraMsgToken,
                to: wpPhone,
                body: wpMessage
            });
            console.log(`💬 Low Stock Alert sent for ${product.name}`);
        }
        // Option C: CallMeBot
        else if (wpApiKey) {
            const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(wpPhone)}&text=${encodeURIComponent(wpMessage)}&apikey=${encodeURIComponent(wpApiKey)}`;
            await axios.get(url);
            console.log(`💬 Low Stock Alert sent for ${product.name}`);
        }
    } catch (err) {
        console.error("❌ Failed to send low stock alert:", err.message);
    }
};

module.exports = router;
