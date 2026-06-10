const express = require('express');
const router = express.Router();
const axios = require('axios');
const Order = require('../models/Order');
const crypto = require('crypto');

// Koko Private Keys
const QA_PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----\nMIICXAIBAAKBgQCnAPcpmvA3Iipb7Fn+eAmO/P4Xv8y+PVm8FrDhqOSeMqaUQmzf\niZ6xw+ejCmye46MMW5SaA03Hnm0WGDXqYhMR0TiWUgXRCeQImxSq+wXwd+0ufxW+\nANnvH9l/mxcPwlGr2BKJTUJy2NQt8FZ9R6NSfIlKzdyGStvzF3j0KdBnjQIDAQAB\nAoGAVMjwsnaurc7yomiD5+UZNTbL6VK+p3aOMCd09ZvBNW+RkoOGspYzsxw6ZVPN\ngX0gMg3si6RRwJ5101nHRY81DmysZ90kgJsknqxUuwKGU6k2Wk18JqJBLGLXilwR\nZ5/NjdgohoZDrJbbr029LNLZ06pvpdXtvVRM9A1XZVzEnAECQQDQ02Wg7nGFvS4M\nyRWMHNARLto19W/Q+BlCsWRCDYO5zns9BtaqzZ3CyOAaXObDs6ZWpCEY+3e84u3X\npvBpdOGtAkEAzLr15YBG9Y3hQgErwIUd0dSlYiDzaIM9DszIh+lzCIi/bUM6nXQi\nIZ0zDJmLjwa0bMduO+ZDiUbxuCFlxhEZYQJAdpTEbhlYr4gYwTvil3i5EjjXwrJH\nt5NazMts0jFYbsd4pdPfTIiMIFLvJylABTtbpnF3Nfd+K+10//OVK10q1QJBAMLU\nqW3exaipfNTziE+OXvJxC3J3KS0st85909iDsZVNjd7NO9rbyh9zGkHDXayfFNTw\ndVdLqrnZae9w2QnE/AECQF+cRPcQMA1wbmOBCyn/C1YAMji71DtplJF9fFOxlp9P\nXdzBrBj9flrwjasEs3WKrepvZ9A0GT5HaG15ULd2/rc=\n-----END RSA PRIVATE KEY-----`;

const PROD_PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----\nMIICXQIBAAKBgQCw1V5rbd5fEmvVbZebzxWicu6SOLwOndJvigBo36wS6iWRmePj\nTDCyLbczmKte77389Ct1y/ENnRjxBQ4693dBSm/SJflnpirb15VThgvm++5ClKUU\nOKPBEWIVtxLxVZxLiz+lk/TyOlVUOm5ioIHZ3Y4jS86sG0A1W8tFrReOEwIDAQAB\nAoGAR2BIdUpqqKtR1VsgB+cFj4WeoGzAE5JGf3kPg0VNOnFCasvX/UYinbjwKqZj\n/bT9Vd3ksO55xQn1KEvnG4wJmSXpxLwkVqX/nHLZ8dIK7ZCsqCbeYoWCwmBTkK+h\nOKrngdx8DKHCryjzDiOULCz4TKUNrklpPOp0g6tvH4EBU5kCQQD7B9n1iAhvWN/k\nHStg3Xg2avd+BYhgoR/sjsBIm3+k7zIHHi0MUPa4KN7KxBMpp/HMALC2iKRIeN/g\no553yPjnAkEAtFWCFduiJAicDUQQ14MJnbT9Ojs8GhN9JH8+1SLyVR2Br23OXxko\nrVfVJo7ggAzI+xtu5SMhU58Li49yBOu/9QJBAMK9V4fTbP+8SYv0WQd/J9fHaZH5\nBtA3jsV8BI0PHJm9+ehtr3LDiHJbOmLAc0E4iSrCSlSAcjnKk5r4M2InpXcCQCfM\nt2kbkC1juQ00eIMX6Idl6n1vlVQr+PKVIsjnbZRbbsPI+EMEynV3bROVdPbN242Q\nAGmR10kdUO78Oa3cWgECQQCJmBp4xHhxQPQUgTrAvoFixSVauSuYxUh523itAfKo\nbPzmEOUUWMeR2zSGgXcZvauFJZodkeYTHGl2MphDn96U\n-----END RSA PRIVATE KEY-----`;

const getPrivateKey = (merchantId) => {
    if (merchantId === 'f189fb3e92507eb60dced60bf2b3b93a') {
        return PROD_PRIVATE_KEY;
    }
    return QA_PRIVATE_KEY;
};


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

        const KOKO_MERCHANT_ID = (process.env.KOKO_MERCHANT_ID || 'c8cca514bdfa0582cdc40c9703c71e9d').trim().replace(/^"(.*)"$/, '$1');
        const KOKO_API_KEY = (process.env.KOKO_API_KEY || '83fA5n1xUaj8OKnX23YY5vlni5q39gBi').trim().replace(/^"(.*)"$/, '$1');
        const BASE_URL = (process.env.KOKO_BASE_URL || 'https://qaapi.paykoko.com').trim().replace(/^"(.*)"$/, '$1');

        const amount = parseFloat(order.totalPrice).toFixed(2);
        const currency = 'LKR';
        const pluginName = 'customapi';
        const pluginVersion = '1.0.1';
        
        const orderIdStr = order._id.toString();
        const kokoReference = 'REF-' + orderIdStr.slice(-14);
        const kokoOrderId = 'ORD-' + orderIdStr.slice(-14);
        const firstName = (order.customerInfo.firstName || 'Customer').trim();
        const lastName = (order.customerInfo.lastName || 'Name').trim();
        const email = (order.customerInfo.email || 'customer@example.com').trim();
        
        // Convert mobile to international format (94...) just like PHP script
        const rawMobile = (order.customerInfo.phone || '0770000000').replace(/[^0-9]/g, '');
        let mobile = rawMobile;
        if (rawMobile.length === 10 && rawMobile[0] === '0') {
            mobile = '94' + rawMobile.substring(1);
        } else if (rawMobile.length === 9) {
            mobile = '94' + rawMobile;
        }

        const productName = 'SkincareProducts';
        
        const rawHost = req.headers['x-forwarded-host'] || req.get('host');
        const host = rawHost.split(',')[0].trim();
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const returnUrl = `${protocol}://${host}/api/payments/koko/return`;
        const cancelUrl = `${protocol}://${host}/api/payments/koko/cancel`;
        const responseUrl = `${protocol}://${host}/api/payments/koko/callback`;

        // KokoPay required data string
        const dataString = KOKO_MERCHANT_ID + amount + currency + pluginName + pluginVersion +
            returnUrl + cancelUrl + kokoOrderId + kokoReference +
            firstName + lastName + email + productName +
            KOKO_API_KEY + responseUrl;

        // The RSA Private Key
        const privateKey = getPrivateKey(KOKO_MERCHANT_ID);

        // Generate RSA SHA256 Signature
        const sign = crypto.createSign('SHA256');
        sign.update(dataString);
        const signatureEncoded = sign.sign(privateKey, 'base64');

        console.log('Koko Session dataString:', dataString);
        console.log('Koko Session signature:', signatureEncoded);

        const formDataParams = new URLSearchParams();
        formDataParams.append('_mId', KOKO_MERCHANT_ID);
        formDataParams.append('api_key', KOKO_API_KEY);
        formDataParams.append('_returnUrl', returnUrl);
        formDataParams.append('_responseUrl', responseUrl);
        formDataParams.append('_currency', currency);
        formDataParams.append('_amount', amount);
        formDataParams.append('_reference', kokoReference);
        formDataParams.append('_pluginName', pluginName);
        formDataParams.append('_pluginVersion', pluginVersion);
        formDataParams.append('_cancelUrl', cancelUrl);
        formDataParams.append('_orderId', kokoOrderId);
        formDataParams.append('_firstName', firstName);
        formDataParams.append('_lastName', lastName);
        formDataParams.append('_email', email);
        formDataParams.append('_description', productName);
        formDataParams.append('dataString', dataString);
        formDataParams.append('signature', signatureEncoded);
        formDataParams.append('_mobileNo', mobile);
        formDataParams.append('mobileNumber', mobile); // Koko sometimes looks for this explicitly

        try {
            const kokoResponse = await axios.post(`${BASE_URL}/api/merchants/orderCreate`, formDataParams, {
                maxRedirects: 0,
                validateStatus: function (status) {
                    return status >= 200 && status < 400; // Resolve if status is a redirect (3xx)
                }
            });

            if (kokoResponse.status >= 300 && kokoResponse.status < 400 && kokoResponse.headers.location) {
                const location = kokoResponse.headers.location;
                const separator = location.includes('?') ? '&' : '?';
                // Append mobileNumber so Koko skips the OTP/identify screen
                const finalUrl = `${location}${separator}mobileNumber=${encodeURIComponent(mobile)}`;
                return res.json({ redirectUrl: finalUrl });
            } else {
                console.error("Koko API error or no redirect. Status:", kokoResponse.status);
                // Fallback to sending form data to frontend if no redirect header found
                return res.json({
                    endpoint: `${BASE_URL}/api/merchants/orderCreate`,
                    formData: {
                        _mId: KOKO_MERCHANT_ID, api_key: KOKO_API_KEY, _returnUrl: returnUrl, _responseUrl: responseUrl,
                        _currency: currency, _amount: amount, _reference: kokoReference, _pluginName: pluginName,
                        _pluginVersion: pluginVersion, _cancelUrl: cancelUrl, _orderId: kokoOrderId, _firstName: firstName,
                        _lastName: lastName, _email: email, _description: productName, dataString: dataString,
                        signature: signatureEncoded, _mobileNo: mobile, mobileNumber: mobile
                    }
                });
            }
        } catch (kokoErr) {
            console.error('Koko API Request Error:', kokoErr.message);
            return res.status(500).json({ message: 'Failed to communicate with Koko API' });
        }

    } catch (error) {
        console.error('KOKO Session Error:', error);
        res.status(500).json({ message: 'Failed to generate KOKO payment session' });
    }
});

// @desc    Create KOKO TEST Payment Session (For QA tests)
// @route   POST /api/payments/koko/test-session
// @access  Public
router.post('/koko/test-session', (req, res) => {
    try {
        const KOKO_MERCHANT_ID = (process.env.KOKO_MERCHANT_ID || 'c8cca514bdfa0582cdc40c9703c71e9d').trim().replace(/^"(.*)"$/, '$1');
        const KOKO_API_KEY = (process.env.KOKO_API_KEY || '83fA5n1xUaj8OKnX23YY5vlni5q39gBi').trim().replace(/^"(.*)"$/, '$1');
        const BASE_URL = (process.env.KOKO_BASE_URL || 'https://qaapi.paykoko.com').trim().replace(/^"(.*)"$/, '$1');

        const amount = '300.00';
        const currency = 'LKR';
        const pluginName = 'customapi';
        const pluginVersion = '1.0.1';
        
        const randomStr = Math.random().toString(36).substring(2, 10);
        const kokoReference = `TEST-${randomStr}`;
        const kokoOrderId = `ORD-${randomStr}`;
        const firstName = 'Test';
        const lastName = 'User';
        const email = 'testuser@example.com';
        const mobile = '0777904054'; 
        const productName = 'SkincareProductsTest';
        
        const rawHost = req.headers['x-forwarded-host'] || req.get('host');
        const host = rawHost.split(',')[0].trim();
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const returnUrl = `${protocol}://${host}/api/payments/koko/return`;
        const cancelUrl = `${protocol}://${host}/api/payments/koko/cancel`;
        const responseUrl = `${protocol}://${host}/api/payments/koko/callback`;

        // KokoPay required data string
        const dataString = KOKO_MERCHANT_ID + amount + currency + pluginName + pluginVersion +
            returnUrl + cancelUrl + kokoOrderId + kokoReference +
            firstName + lastName + email + productName +
            KOKO_API_KEY + responseUrl;

        // The RSA Private Key
        const privateKey = getPrivateKey(KOKO_MERCHANT_ID);

        // Generate RSA SHA256 Signature
        const sign = crypto.createSign('SHA256');
        sign.update(dataString);
        const signatureEncoded = sign.sign(privateKey, 'base64');

        console.log('Koko Test Session dataString:', dataString);
        console.log('Koko Test Session signature:', signatureEncoded);

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
        console.error('KOKO Test Session Error:', error);
        res.status(500).json({ message: 'Failed to generate KOKO test payment session' });
    }
});

// @desc    KOKO Callback (Payment Confirmation - Webhook POST)
// @route   POST /api/payments/koko/callback
router.post('/koko/callback', async (req, res) => {
    try {
        const { orderId, trnId, status, signature } = req.body;
        console.log('KOKO Webhook POST received:', { orderId, trnId, status });

        if (!orderId || !trnId || !status || !signature) {
            console.warn('KOKO Webhook: Missing parameters');
            return res.status(400).send('Missing parameters');
        }

        // 1. Prepare Data String (orderId + trnId + status)
        const dataString = orderId + trnId + status;

        // 2. Koko Public Key
        const KOKO_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDDwDt4Q9B+MEAcxP8pPeTYGh22
lvCOxxKEwDuJPAvTtYpfiqU1Ip//njnMgWIpFcpIcqabALPrkHW8eD37SBzQ6R5l
fr01xf7lBG3bGqNXZkdXb0txnoXSmPya+B4oGqZc+KWNrKTntY3sNKD6k4tdOeoX
83rxb/gnZR5v7WP7WQIDAQAB
-----END PUBLIC KEY-----`;

        // 3. Verify Signature
        const isVerified = crypto.verify(
            'sha256',
            Buffer.from(dataString),
            KOKO_PUBLIC_KEY,
            Buffer.from(signature, 'base64')
        );

        if (!isVerified) {
            console.warn('KOKO Webhook: Invalid Signature');
            return res.status(400).send('Invalid Signature');
        }

        // 4. Find the order (using clean full orderId)
        const cleanOrderId = orderId.replace('ORD-', '').replace('REF-', '');
        let order = null;
        if (cleanOrderId && cleanOrderId.length === 24) {
            order = await Order.findById(cleanOrderId);
        } else {
            const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
            order = orders.find(o => o._id.toString().startsWith(cleanOrderId));
        }

        if (order) {
            if (status === 'SUCCESS') {
                order.isPaid = true;
                order.paidAt = Date.now();
                order.paymentResult = {
                    id: trnId,
                    status: status,
                    update_time: new Date().toISOString()
                };
                await order.save();
                console.log(`✅ Order ${order._id} marked as paid via Koko Webhook`);
            } else {
                console.warn(`KOKO Webhook status: ${status} for order ${order._id}`);
            }
            return res.send('OK');
        } else {
            console.error(`KOKO Webhook: Order not found for prefix ${orderId}`);
            return res.status(404).send('Order not found');
        }
    } catch (error) {
        console.error('KOKO Webhook Error:', error);
        return res.status(500).send('Server Error');
    }
});

// @desc    KOKO Callback (Payment Confirmation - Webhook GET fallback/legacy)
// @route   GET /api/payments/koko/callback
router.get('/koko/callback', async (req, res) => {
    const { reference, status } = req.query;
    console.log('KOKO Callback GET received:', { reference, status });

    try {
        if (reference) {
            const cleanRef = reference.replace('REF-', '').replace('ORD-', '');
            let order = null;
            if (cleanRef && cleanRef.length === 24) {
                order = await Order.findById(cleanRef);
            } else {
                const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
                order = orders.find(o => o._id.toString().startsWith(cleanRef));
            }

            if (order && status === 'SUCCESS') {
                order.isPaid = true;
                order.paidAt = Date.now();
                await order.save();
                return res.redirect('/checkout.html?payment=success');
            }
        }
        return res.redirect('/checkout.html?payment=failed');
    } catch (error) {
        console.error('KOKO Callback GET Error:', error);
        res.redirect('/checkout.html?payment=error');
    }
});

// @desc    KOKO Return (User redirected back after successful payment)
// @route   GET /api/payments/koko/return
router.get('/koko/return', async (req, res) => {
    const { orderId, status } = req.query;
    console.log('KOKO Return GET received:', { orderId, status });

    try {
        if (orderId) {
            const cleanOrderId = orderId.replace('ORD-', '').replace('REF-', '');
            let order = null;
            if (cleanOrderId && cleanOrderId.length === 24) {
                order = await Order.findById(cleanOrderId);
            } else {
                const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
                order = orders.find(o => o._id.toString().startsWith(cleanOrderId));
            }

            if (order && (status === 'SUCCESS' || !status)) {
                order.isPaid = true;
                order.paidAt = Date.now();
                await order.save();
            }
        }
    } catch (error) {
        console.error('KOKO Return GET Error:', error);
    }
    res.redirect('/checkout.html?payment=success');
});

// @desc    KOKO Cancel (User cancelled payment)
// @route   GET /api/payments/koko/cancel
router.get('/koko/cancel', (req, res) => {
    res.redirect('/checkout.html?payment=cancelled');
});

module.exports = router;
