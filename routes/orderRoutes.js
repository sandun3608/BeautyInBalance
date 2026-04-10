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
            customerInfo,
            orderItems,
            shippingPrice,
            paymentMethod,
            totalPrice
        });

        const createdOrder = await order.save();

        // --- EMAIL NOTIFICATION (ASYNCHRONOUS) ---
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const sendEmail = require('../utils/mailer');
            const itemsList = createdOrder.orderItems.map(i => `<li>${i.qty}x ${i.name} - Rs. ${i.price.toLocaleString()}</li>`).join('');
            
            try {
                await sendEmail({
                    email: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
                    subject: `🛍️ New Order Received! #${createdOrder._id.toString().slice(-6).toUpperCase()}`,
                    html: `
                        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                            <h2 style="color: #b58646;">New Order Notification</h2>
                            <p>You have received a new order from <strong>${createdOrder.customerInfo.firstName} ${createdOrder.customerInfo.lastName}</strong>.</p>
                            
                            <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Details</h3>
                            <ul>${itemsList}</ul>
                            <p><strong>Total Price:</strong> Rs. ${createdOrder.totalPrice.toLocaleString()}</p>
                            <p><strong>Payment Method:</strong> ${createdOrder.paymentMethod}</p>
                            
                            <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">Customer Contact</h3>
                            <p><strong>Email:</strong> ${createdOrder.customerInfo.email}</p>
                            <p><strong>Phone:</strong> ${createdOrder.customerInfo.phone}</p>
                            <p><strong>Address:</strong> ${createdOrder.customerInfo.address}, ${createdOrder.customerInfo.city}</p>
                            
                            <div style="margin-top: 30px;">
                                <a href="https://wa.me/${createdOrder.customerInfo.phone.replace(/[^0-9]/g, '')}" style="background: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">WhatsApp Customer</a>
                            </div>
                        </div>
                    `
                });
                console.log("📧 Order notification email sent successfully!");
            } catch (err) {
                console.error("📧 Email sending failed:", err);
            }
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error("Order Creation Error:", error);
        res.status(500).json({ message: 'Failed to create order on server' });
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


module.exports = router;
