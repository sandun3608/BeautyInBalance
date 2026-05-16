const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
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
        const orders = await Order.find({}).sort({ createdAt: -1 }); // Newest first
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

module.exports = router;
