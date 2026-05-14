const express = require('express');
const router = express.Router();
const axios = require('axios');
const Order = require('../models/Order');

const crypto = require('crypto');

// @desc    Create KOKO Payment Session (Returns form data for frontend submission)
// @route   POST /api/payments/koko/create-session
// @access  Public
router.post('/koko/create-session', async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const KOKO_MERCHANT_ID = process.env.KOKO_MERCHANT_ID || 'c8cca514bdfa0582cdc40c9703c71e9d';
        const KOKO_API_KEY = process.env.KOKO_API_KEY || '83fA5n1xUaj8OKnX23YY5vlni5q39gBi';
        const BASE_URL = process.env.KOKO_BASE_URL || 'https://qaapi.paykoko.com';

        // HARDCODING EXACT VALUES FROM PHPQA.PHP TO ISOLATE THE ERROR
        const amount = '300.00';
        const currency = 'LKR';
        const pluginName = 'customapi';
        const pluginVersion = '1.0.1';
        
        const kokoReference = 'REF123';
        const kokoOrderId = 'ORD123';
        const firstName = 'John';
        const lastName = 'Doe';
        const email = 'john@gmail.com';
        const mobile = '0777904054'; 
        const productName = 'products';
        
        // Hardcoding beimmune URLs because Koko QA account might be whitelisted ONLY for this domain
        const returnUrl = 'https://www.beimmune.lk/return';
        const cancelUrl = 'https://www.beimmune.lk/cancel';
        const responseUrl = 'https://www.beimmune.lk/response';

        // KokoPay required data string
        const dataString = KOKO_MERCHANT_ID + amount + currency + pluginName + pluginVersion +
            returnUrl + cancelUrl + kokoOrderId + kokoReference +
            firstName + lastName + email + productName +
            KOKO_API_KEY + responseUrl;

        // The RSA Private Key
        const privateKey = `-----BEGIN RSA PRIVATE KEY-----\nMIICXAIBAAKBgQCnAPcpmvA3Iipb7Fn+eAmO/P4Xv8y+PVm8FrDhqOSeMqaUQmzf\niZ6xw+ejCmye46MMW5SaA03Hnm0WGDXqYhMR0TiWUgXRCeQImxSq+wXwd+0ufxW+\nANnvH9l/mxcPwlGr2BKJTUJy2NQt8FZ9R6NSfIlKzdyGStvzF3j0KdBnjQIDAQAB\nAoGAVMjwsnaurc7yomiD5+UZNTbL6VK+p3aOMCd09ZvBNW+RkoOGspYzsxw6ZVPN\ngX0gMg3si6RRwJ5101nHRY81DmysZ90kgJsknqxUuwKGU6k2Wk18JqJBLGLXilwR\nZ5/NjdgohoZDrJbbr029LNLZ06pvpdXtvVRM9A1XZVzEnAECQQDQ02Wg7nGFvS4M\nyRWMHNARLto19W/Q+BlCsWRCDYO5zns9BtaqzZ3CyOAaXObDs6ZWpCEY+3e84u3X\npvBpdOGtAkEAzLr15YBG9Y3hQgErwIUd0dSlYiDzaIM9DszIh+lzCIi/bUM6nXQi\nIZ0zDJmLjwa0bMduO+ZDiUbxuCFlxhEZYQJAdpTEbhlYr4gYwTvil3i5EjjXwrJH\nt5NazMts0jFYbsd4pdPfTIiMIFLvJylABTtbpnF3Nfd+K+10//OVK10q1QJBAMLU\nqW3exaipfNTziE+OXvJxC3J3KS0st85909iDsZVNjd7NO9rbyh9zGkHDXayfFNTw\ndVdLqrnZae9w2QnE/AECQF+cRPcQMA1wbmOBCyn/C1YAMji71DtplJF9fFOxlp9P\nXdzBrBj9flrwjasEs3WKrepvZ9A0GT5HaG15ULd2/rc=\n-----END RSA PRIVATE KEY-----`;

        // Generate RSA SHA256 Signature
        const sign = crypto.createSign('SHA256');
        sign.update(dataString);
        sign.end();
        const signatureEncoded = sign.sign(privateKey, 'base64');

        // Return the required form data to the frontend
        res.json({
            endpoint: `${BASE_URL}/api/merchants/orderCreate`,
            formData: {
                _mId: KOKO_MERCHANT_ID,
                api_key: KOKO_API_KEY,
                _returnUrl: returnUrl,
                _responseUrl: responseUrl,
                _currency: currency,
                _amount: amount,
                _reference: kokoReference,
                _pluginName: pluginName,
                _pluginVersion: pluginVersion,
                _cancelUrl: cancelUrl,
                _orderId: kokoOrderId,
                _firstName: firstName,
                _lastName: lastName,
                _email: email,
                _description: productName,
                dataString: dataString,
                signature: signatureEncoded,
                _mobileNo: mobile
            }
        });

    } catch (error) {
        console.error('KOKO Session Error:', error);
        res.status(500).json({ message: 'Failed to generate KOKO payment session' });
    }
});

// @desc    KOKO Callback (Payment Confirmation)
// @route   GET /api/payments/koko/callback
router.get('/koko/callback', async (req, res) => {
    const { reference, status } = req.query;

    try {
        // Since reference is truncated to 15 chars, we need to find the matching order
        const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
        const order = orders.find(o => o._id.toString().startsWith(reference));

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

// @desc    KOKO Return (User redirected back after successful payment)
// @route   GET /api/payments/koko/return
router.get('/koko/return', (req, res) => {
    res.redirect('/checkout.html?payment=success');
});

// @desc    KOKO Cancel (User cancelled payment)
// @route   GET /api/payments/koko/cancel
router.get('/koko/cancel', (req, res) => {
    res.redirect('/checkout.html?payment=cancelled');
});

module.exports = router;
