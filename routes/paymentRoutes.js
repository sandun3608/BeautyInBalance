const express = require('express');
const router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const crypto = require('crypto');

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

// Koko Private Keys
const QA_PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----\nMIICXAIBAAKBgQCnAPcpmvA3Iipb7Fn+eAmO/P4Xv8y+PVm8FrDhqOSeMqaUQmzf\niZ6xw+ejCmye46MMW5SaA03Hnm0WGDXqYhMR0TiWUgXRCeQImxSq+wXwd+0ufxW+\nANnvH9l/mxcPwlGr2BKJTUJy2NQt8FZ9R6NSfIlKzdyGStvzF3j0KdBnjQIDAQAB\nAoGAVMjwsnaurc7yomiD5+UZNTbL6VK+p3aOMCd09ZvBNW+RkoOGspYzsxw6ZVPN\ngX0gMg3si6RRwJ5101nHRY81DmysZ90kgJsknqxUuwKGU6k2Wk18JqJBLGLXilwR\nZ5/NjdgohoZDrJbbr029LNLZ06pvpdXtvVRM9A1XZVzEnAECQQDQ02Wg7nGFvS4M\nyRWMHNARLto19W/Q+BlCsWRCDYO5zns9BtaqzZ3CyOAaXObDs6ZWpCEY+3e84u3X\npvBpdOGtAkEAzLr15YBG9Y3hQgErwIUd0dSlYiDzaIM9DszIh+lzCIi/bUM6nXQi\nIZ0zDJmLjwa0bMduO+ZDiUbxuCFlxhEZYQJAdpTEbhlYr4gYwTvil3i5EjjXwrJH\nt5NazMts0jFYbsd4pdPfTIiMIFLvJylABTtbpnF3Nfd+K+10//OVK10q1QJBAMLU\nqW3exaipfNTziE+OXvJxC3J3KS0st85909iDsZVNjd7NO9rbyh9zGkHDXayfFNTw\ndVdLqrnZae9w2QnE/AECQF+cRPcQMA1wbmOBCyn/C1YAMji71DtplJF9fFOxlp9P\nXdzBrBj9flrwjasEs3WKrepvZ9A0GT5HaG15ULd2/rc=\n-----END RSA PRIVATE KEY-----`;

const PROD_PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----\nMIICXQIBAAKBgQCw1V5rbd5fEmvVbZebzxWicu6SOLwOndJvigBo36wS6iWRmePj\nTDCyLbczmKte77389Ct1y/ENnRjxBQ4693dBSm/SJflnpirb15VThgvm++5ClKUU\nOKPBEWIVtxLxVZxLiz+lk/TyOlVUOm5ioIHZ3Y4jS86sG0A1W8tFrReOEwIDAQAB\nAoGAR2BIdUpqqKtR1VsgB+cFj4WeoGzAE5JGf3kPg0VNOnFCasvX/UYinbjwKqZj\n/bT9Vd3ksO55xQn1KEvnG4wJmSXpxLwkVqX/nHLZ8dIK7ZCsqCbeYoWCwmBTkK+h\nOKrngdx8DKHCryjzDiOULCz4TKUNrklpPOp0g6tvH4EBU5kCQQD7B9n1iAhvWN/k\nHStg3Xg2avd+BYhgoR/sjsBIm3+k7zIHHi0MUPa4KN7KxBMpp/HMALC2iKRIeN/g\no553yPjnAkEAtFWCFduiJAicDUQQ14MJnbT9Ojs8GhN9JH8+1SLyVR2Br23OXxko\nrVfVJo7ggAzI+xtu5SMhU58Li49yBOu/9QJBAMK9V4fTbP+8SYv0WQd/J9fHaZH5\nBtA3jsV8BI0PHJm9+ehtr3LDiHJbOmLAc0E4iSrCSlSAcjnKk5r4M2InpXcCQCfM\nt2kbkC1juQ00eIMX6Idl6n1vlVQr+PKVIsjnbZRbbsPI+EMEynV3bROVdPbN242Q\nAGmR10kdUO78Oa3cWgECQQCJmBp4xHhxQPQUgTrAvoFixSVauSuYxUh523itAfKo\nbPzmEOUUWMeR2zSGgXcZvauFJZodkeYTHGl2MphDn96U\n-----END RSA PRIVATE KEY-----`;

const getPrivateKey = (merchantId) => {
    if (merchantId === 'f189fb3e92507eb60dced60bf2b3b93a') {
        return PROD_PRIVATE_KEY;
    }
    return QA_PRIVATE_KEY;
};


// @desc    Generate KOKO Payment HTML Redirect
// @route   GET /api/payments/koko/redirect/:orderId
// @access  Public
router.get('/koko/redirect/:orderId', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);

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
        
        const rawMobile = (order.customerInfo.phone || '0770000000').replace(/[^0-9]/g, '');
        let mobile = rawMobile; // Use raw 077... format as Koko seems to reject 9477... format

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

        const kokoUrl = `${BASE_URL}/api/merchants/orderCreate`;

        // Generate the exact HTML used by the official Koko PHP plugin
        const darazbnpl_args = {
            '_mId': KOKO_MERCHANT_ID,
            'api_key': KOKO_API_KEY,
            '_returnUrl': returnUrl,
            '_responseUrl': responseUrl,
            '_currency': currency,
            '_amount': amount,
            '_reference': kokoReference,
            '_pluginName': pluginName,
            '_pluginVersion': pluginVersion,
            '_cancelUrl': cancelUrl,
            '_orderId': kokoOrderId,
            '_firstName': firstName,
            '_lastName': lastName,
            '_email': email,
            '_description': productName,
            'dataString': dataString,
            'signature': signatureEncoded,
            '_mobileNo': mobile
        };

        let inputsHtml = '';
        for (const key in darazbnpl_args) {
            inputsHtml += `<input type='hidden' name='${key}' value='${darazbnpl_args[key]}'/>\n`;
        }

        const htmlResponse = `<!DOCTYPE html>
<html>
<head>
    <title>Redirecting to Koko...</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #f9f9f9; }
        .loader { border: 4px solid #f3f3f3; border-top: 4px solid #f900a0; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 20px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .button-alt { margin-top: 20px; padding: 10px 20px; background-color: #f900a0; color: white; border: none; border-radius: 5px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="loader"></div>
    <p>Redirecting to Koko Payment Gateway...</p>
    <form action="${kokoUrl}" method="post" id="darazbnpl_payment_form">
        ${inputsHtml}
        <input type="submit" class="button-alt" id="submit_darazbnpl_payment_form" value="Click here if not redirected automatically" />
    </form>
    <script type="text/javascript">
        document.getElementById("submit_darazbnpl_payment_form").style.display = "none";
        document.getElementById("darazbnpl_payment_form").submit();
    </script>
</body>
</html>`;

        res.send(htmlResponse);

    } catch (error) {
        console.error('KOKO Redirect Error:', error);
        res.status(500).send('Failed to generate KOKO payment session');
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
                if (!order.isPaid) {
                    order.isPaid = true;
                    order.paidAt = Date.now();
                    order.paymentResult = {
                        id: trnId,
                        status: status,
                        update_time: new Date().toISOString()
                    };
                    await order.save();
                    console.log(`✅ Order ${order._id} marked as paid via Koko Webhook`);
                    await sendWhatsAppNotification(order);
                    await sendCustomerWhatsAppNotification(order, 'placed');
                    await reduceProductStock(order);
                } else {
                    console.log(`Order ${order._id} is already marked as paid.`);
                }
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
                if (!order.isPaid) {
                    order.isPaid = true;
                    order.paidAt = Date.now();
                    await order.save();
                    await sendWhatsAppNotification(order);
                    await sendCustomerWhatsAppNotification(order, 'placed');
                    await reduceProductStock(order);
                }
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
                if (!order.isPaid) {
                    order.isPaid = true;
                    order.paidAt = Date.now();
                    await order.save();
                    await sendWhatsAppNotification(order);
                    await sendCustomerWhatsAppNotification(order, 'placed');
                    await reduceProductStock(order);
                }
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

// Helper function to send WhatsApp Notifications on Payment Success
const sendWhatsAppNotification = async (order) => {
    try {
        const rawWpPhone = process.env.WHATSAPP_PHONE;
        const wpPhone = formatWhatsAppPhone(rawWpPhone);
        const greenApiId = process.env.GREEN_API_ID_INSTANCE;
        const greenApiToken = process.env.GREEN_API_TOKEN_INSTANCE;
        const ultraMsgInstance = process.env.ULTRAMSG_INSTANCE_ID;
        const ultraMsgToken = process.env.ULTRAMSG_TOKEN;
        const wpApiKey = process.env.WHATSAPP_API_KEY;

        if (!wpPhone) return;

        const customerName = `${order.customerInfo?.firstName || 'Customer'} ${order.customerInfo?.lastName || ''}`;
        const orderIdShort = order._id.toString().slice(-6).toUpperCase();
        
        let wpMessage = `*🚨 New Order Placed! #${orderIdShort}*\n\n` +
                        `*Customer:* ${customerName}\n` +
                        `*Total:* Rs. ${order.totalPrice.toLocaleString()}\n` +
                        `*Payment:* ${order.paymentMethod}\n` +
                        `*Phone:* ${order.customerInfo?.phone || 'N/A'}\n` +
                        `*City:* ${order.customerInfo?.city || 'N/A'}\n\n` +
                        `Check details: https://www.beautyinbalance.lk/admin`;

        // Option A: Green API Integration
        if (greenApiId && greenApiToken) {
            const url = `https://api.green-api.com/waInstance${greenApiId}/sendMessage/${greenApiToken}`;
            await axios.post(url, {
                chatId: `${wpPhone}@c.us`,
                message: wpMessage
            });
            console.log(`💬 Green API WhatsApp notification sent for order ${order._id}`);
        }
        // Option B: UltraMsg Integration
        else if (ultraMsgInstance && ultraMsgToken) {
            const url = `https://api.ultramsg.com/${ultraMsgInstance}/messages/chat`;
            await axios.post(url, {
                token: ultraMsgToken,
                to: wpPhone,
                body: wpMessage
            });
            console.log(`💬 UltraMsg WhatsApp notification sent for order ${order._id}`);
        }
        // Option C: CallMeBot Integration (Fallback)
        else if (wpApiKey) {
            const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(wpPhone)}&text=${encodeURIComponent(wpMessage)}&apikey=${encodeURIComponent(wpApiKey)}`;
            await axios.get(url);
            console.log(`💬 CallMeBot WhatsApp notification sent for order ${order._id}`);
        }
    } catch (err) {
        console.error("❌ WhatsApp notification failed:", err.message);
    }
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
        const rawWpPhone = process.env.WHATSAPP_PHONE;
        const wpPhone = formatWhatsAppPhone(rawWpPhone);
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
