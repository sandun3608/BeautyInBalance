const express = require('express');
const router = express.Router();
const axios = require('axios');
const Order = require('../models/Order');

// @desc    Create KOKO Payment Session
// @route   POST /api/payments/koko/create-session
// @access  Public
router.post('/koko/create-session', async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const KOKO_MERCHANT_ID = process.env.KOKO_MERCHANT_ID || '1000014547';
        const KOKO_API_KEY = process.env.KOKO_API_KEY || 'JCW8AaEYjsnhgnQd1rAye4UtZOBtA0Dg';
        const BASE_URL = process.env.NODE_ENV === 'production' 
            ? 'https://api.paykoko.com' 
            : 'https://api-sandbox.paykoko.com';

        // KOKO Checkout Payload
        const payload = {
            amount: order.totalPrice,
            currency: 'LKR',
            reference: order._id.toString(),
            description: `Order from Beauty in Balance - ${order._id}`,
            customer: {
                first_name: order.customerInfo.firstName,
                last_name: order.customerInfo.lastName,
                email: order.customerInfo.email,
                phone: order.customerInfo.phone
            },
            response_url: `${req.protocol}://${req.get('host')}/api/payments/koko/callback`,
            cancel_url: `${req.protocol}://${req.get('host')}/checkout.html?payment=cancelled`
        };

        const response = await axios.post(`${BASE_URL}/v1/checkout`, payload, {
            headers: {
                'Authorization': `Bearer ${KOKO_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.data && response.data.url) {
            res.json({ checkoutUrl: response.data.url });
        } else {
            res.status(500).json({ message: 'Failed to create KOKO session' });
        }

    } catch (error) {
        console.error('KOKO Session Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Payment gateway connection failed' });
    }
});

// @desc    KOKO Callback (Payment Confirmation)
// @route   GET /api/payments/koko/callback
router.get('/koko/callback', async (req, res) => {
    const { reference, status } = req.query;

    try {
        const order = await Order.findById(reference);

        if (order && status === 'SUCCESS') {
            order.isPaid = true;
            order.paidAt = Date.now();
            await order.save();
            return res.redirect('/checkout.html?payment=success');
        } else {
            return res.redirect('/checkout.html?payment=failed');
        }
    } catch (error) {
        console.error('KOKO Callback Error:', error);
        res.redirect('/checkout.html?payment=error');
    }
});

module.exports = router;
