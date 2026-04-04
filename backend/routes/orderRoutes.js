const express = require('express');
const router = express.Router();
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
        const order = await Order.findById(req.params.id);
        if (order) {
            order.isDelivered = true;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
