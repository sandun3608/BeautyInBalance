const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

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

        const isOnlinePayment = ['Koko', 'Card Payment'].includes(createdOrder.paymentMethod);

        // --- EMAIL NOTIFICATIONS (BACKGROUND) ---
        // For online payments (Koko / Card), hold confirmation emails until payment is confirmed as PAID
        if (!isOnlinePayment || createdOrder.isPaid) {
            const { sendOrderConfirmation } = require('../utils/mailer');
            sendOrderConfirmation(createdOrder);
        } else {
            console.log(`ℹ️ Order ${createdOrder._id} is ${createdOrder.paymentMethod} (unpaid). Confirmation emails held until payment is confirmed.`);
        }

        // --- WHATSAPP NOTIFICATIONS (Green API / UltraMsg / CallMeBot) ---
        const rawWpPhone = process.env.WHATSAPP_PHONE;
        const wpPhones = rawWpPhone ? rawWpPhone.split(',').map(p => formatWhatsAppPhone(p.trim())).filter(p => p) : [];
        const greenApiId = process.env.GREEN_API_ID_INSTANCE;
        const greenApiToken = process.env.GREEN_API_TOKEN_INSTANCE;
        const ultraMsgInstance = process.env.ULTRAMSG_INSTANCE_ID;
        const ultraMsgToken = process.env.ULTRAMSG_TOKEN;
        const wpApiKey = process.env.WHATSAPP_API_KEY;

        if (wpPhones.length > 0 && (!isOnlinePayment || createdOrder.isPaid)) {
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

            for (const wpPhone of wpPhones) {
                // Option A: Green API Integration
                if (greenApiId && greenApiToken) {
                    const url = `https://api.green-api.com/waInstance${greenApiId}/sendMessage/${greenApiToken}`;
                    axios.post(url, {
                        chatId: `${wpPhone}@c.us`,
                        message: wpMessage
                    })
                    .then(() => console.log(`💬 Green API WhatsApp notification sent for order ${createdOrder._id} to ${wpPhone}`))
                    .catch(err => console.error(`❌ Green API notification failed for ${wpPhone}:`, err.message));
                }
                // Option B: UltraMsg Integration
                else if (ultraMsgInstance && ultraMsgToken) {
                    const url = `https://api.ultramsg.com/${ultraMsgInstance}/messages/chat`;
                    axios.post(url, {
                        token: ultraMsgToken,
                        to: wpPhone,
                        body: wpMessage
                    })
                    .then(() => console.log(`💬 UltraMsg WhatsApp notification sent for order ${createdOrder._id} to ${wpPhone}`))
                    .catch(err => console.error(`❌ UltraMsg notification failed for ${wpPhone}:`, err.message));
                }
                // Option C: CallMeBot Integration (Fallback)
                else if (wpApiKey) {
                    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(wpPhone)}&text=${encodeURIComponent(wpMessage)}&apikey=${encodeURIComponent(wpApiKey)}`;
                    axios.get(url)
                        .then(() => console.log(`💬 CallMeBot WhatsApp notification sent for order ${createdOrder._id} to ${wpPhone}`))
                        .catch(err => console.error(`❌ CallMeBot notification failed for ${wpPhone}:`, err.message));
                }
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
        const orders = await Order.find({}).sort({ createdAt: -1 }).lean(); // Newest first, lean objects
        res.json(orders || []);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: 'Failed to fetch orders: ' + (error.message || 'Unknown database error') });
    }
});

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
        res.json(orders || []);
    } catch (error) {
        console.error("Error fetching my orders:", error);
        res.status(500).json({ message: 'Failed to fetch your orders: ' + (error.message || 'Unknown database error') });
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

            // --- SEND DELIVERY EMAIL TO CUSTOMER (BACKGROUND) ---
            if (process.env.RESEND_API_KEY || (process.env.EMAIL_USER && (process.env.GOOGLE_CLIENT_ID || process.env.EMAIL_PASS))) {
                const sendEmail = require('../utils/mailer');
                
                try {
                    const customerName = `${updatedOrder.customerInfo?.firstName || 'Customer'} ${updatedOrder.customerInfo?.lastName || ''}`;
                    const orderIdShort = updatedOrder._id.toString().slice(-6).toUpperCase();

                    const siteUrl = process.env.SITE_URL || 'https://www.beautyinbalance.lk';
                    const itemsHtml = (updatedOrder.orderItems || []).map(i => `
                        <tr>
                            <td style="padding: 10px 0; color: #4A4440; font-size: 14px; border-bottom: 1px dashed #EDE5D9;">
                                <span style="font-weight: 700; color: #2D2727;">${i.qty}x</span> ${i.name}
                            </td>
                            <td style="padding: 10px 0; text-align: right; font-weight: 700; color: #2D2727; font-size: 14px; border-bottom: 1px dashed #EDE5D9;">
                                Rs. ${(Number(i.price) * (i.qty || 1)).toLocaleString()}
                            </td>
                        </tr>
                    `).join('');

                    sendEmail({
                        email: updatedOrder.customerInfo.email,
                        subject: `Your Order Has Been Shipped! #${orderIdShort} 📦✨`,
                        html: `
                            <div style="background-color: #F8F6F2; padding: 25px 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #ECE5DC;">
                                    
                                    <!-- Main Content Card -->
                                    <div style="padding: 35px 25px 30px 25px;">
                                        
                                        <!-- Status Badge -->
                                        <div style="text-align: center; margin-bottom: 12px;">
                                            <span style="display: inline-block; background: #F8F5F0; color: #B58646; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 5px 16px; border-radius: 30px; border: 1px solid #EAE2D8;">
                                                📦 Order Shipped • On The Way
                                            </span>
                                        </div>

                                        <!-- Topic / Title -->
                                        <h1 style="color: #2D2727; font-size: 24px; font-weight: 700; text-align: center; margin: 0 0 6px 0; letter-spacing: 0.3px;">
                                            Your Order Has Been Shipped!
                                        </h1>
                                        <p style="text-align: center; color: #8C827A; font-size: 13px; margin: 0 0 18px 0;">
                                            Beauty in Balance • Island-wide Authentic Skincare
                                        </p>

                                        <!-- Centered Card Image (Slightly smaller, right after topic) -->
                                        <div style="text-align: center; margin: 0 auto 25px auto;">
                                            <img src="${siteUrl}/order-shipped-card.jpg" alt="Thank You • Your order has shipped!" style="width: 100%; max-width: 320px; height: auto; display: block; margin: 0 auto; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.04);" />
                                        </div>

                                        <!-- Greeting -->
                                        <p style="font-size: 15px; color: #4A4440; line-height: 1.6; margin: 0 0 12px 0;">
                                            Hi <strong>${updatedOrder.customerInfo?.firstName || 'Valued Customer'}</strong>,
                                        </p>
                                        <p style="font-size: 15px; color: #554F4B; line-height: 1.7; margin: 0 0 25px 0;">
                                            Exciting news! Your Beauty in Balance order <span style="background: #FAF0E6; color: #B58646; padding: 3px 8px; border-radius: 6px; font-weight: 700; border: 1px solid #F0DFCE;">#${orderIdShort}</span> has been packed with care and is now officially on its way to you!
                                        </p>

                                        <!-- Order Summary Card -->
                                        <div style="background: #FAF9F6; border: 1px solid #EFEAE3; border-radius: 14px; padding: 20px 22px; margin-bottom: 25px;">
                                            
                                            <!-- Header Row with Table -->
                                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-bottom: 1px solid #ECE3D6; padding-bottom: 12px; margin-bottom: 14px;">
                                                <tr>
                                                    <td align="left" style="font-size: 15px; font-weight: 700; color: #2D2727; vertical-align: middle;">
                                                        🛍️ Order Summary
                                                    </td>
                                                    <td align="right" style="font-size: 13px; font-weight: 700; vertical-align: middle;">
                                                        <span style="background: #F3ECE4; color: #B58646; padding: 4px 10px; border-radius: 6px; font-weight: 700; border: 1px solid #E5D8CA; letter-spacing: 0.5px;">#${orderIdShort}</span>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            <!-- Items Table -->
                                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse;">
                                                <tbody>
                                                    ${itemsHtml}
                                                </tbody>
                                            </table>

                                            <!-- Total Paid Table -->
                                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-top: 14px; border-top: 1px solid #ECE3D6; padding-top: 14px;">
                                                <tr>
                                                    <td align="left" style="font-size: 15px; font-weight: 700; color: #2D2727; vertical-align: middle;">
                                                        Total Paid:
                                                    </td>
                                                    <td align="right" style="font-size: 19px; font-weight: 800; color: #B58646; vertical-align: middle;">
                                                        Rs. ${Number(updatedOrder.totalPrice).toLocaleString()}
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>

                                        <!-- Elegant Minimalist Thank You Box -->
                                        <div style="background: #FAFAF8; border: 1px solid #EFEAE3; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 25px;">
                                            <p style="margin: 0; color: #2D2727; font-weight: 700; font-size: 15px; letter-spacing: 0.3px;">
                                                Thank You for Choosing Beauty in Balance
                                            </p>
                                            <p style="margin: 8px 0 0 0; color: #6E6762; font-size: 13px; line-height: 1.6;">
                                                Every product is 100% authentic and handled with care to bring out your skin's natural radiance. We hope you enjoy your new skincare essentials! ✨
                                            </p>
                                        </div>

                                        <!-- Footer with Brand Logo at the Bottom -->
                                        <div style="text-align: center; border-top: 1px solid #EFEAE3; padding-top: 25px; color: #8F847D; font-size: 12px; line-height: 1.6;">
                                            <a href="https://www.beautyinbalance.lk" target="_blank" style="text-decoration: none; display: inline-block; margin-bottom: 12px;">
                                                <img src="${siteUrl}/favicon.png" alt="Beauty in Balance" style="width: 75px; max-width: 75px; height: auto; display: block; margin: 0 auto;" />
                                            </a>
                                            <p style="margin: 0 0 6px 0;">
                                                Have questions about your delivery? We are always here to help.
                                            </p>
                                            <p style="margin: 0 0 14px 0;">
                                                Contact us at <a href="mailto:${process.env.EMAIL_USER || 'support@beautyinbalance.lk'}" style="color: #B58646; text-decoration: underline; font-weight: 700;">${process.env.EMAIL_USER || 'support@beautyinbalance.lk'}</a>
                                            </p>
                                            <p style="margin: 0; font-size: 11px; color: #B0A59E;">
                                                © ${new Date().getFullYear()} Beauty in Balance. 100% Authentic Skincare & Cosmetics.
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        `
                    }).then(() => console.log(`📧 Shipped email sent to customer for order ${updatedOrder._id}`))
                      .catch(err => console.error("📧 Customer shipped email error:", err));
                } catch (emailBuildErr) {
                    console.error("❌ Failed to build delivery email:", emailBuildErr);
                }
            }

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
                        `Great news! Your *Beauty in Balance* order *#${orderIdShort}* has been shipped and is on the way! 🚚✨\n` +
                        `Thank you for choosing Beauty in Balance. 100% authentic skincare curated for you.\n\n` +
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
        const wpPhones = rawWpPhone ? rawWpPhone.split(',').map(p => formatWhatsAppPhone(p.trim())).filter(p => p) : [];
        const greenApiId = process.env.GREEN_API_ID_INSTANCE;
        const greenApiToken = process.env.GREEN_API_TOKEN_INSTANCE;
        const ultraMsgInstance = process.env.ULTRAMSG_INSTANCE_ID;
        const ultraMsgToken = process.env.ULTRAMSG_TOKEN;
        const wpApiKey = process.env.WHATSAPP_API_KEY;

        if (wpPhones.length === 0) return;

        let wpMessage = `*⚠️ LOW STOCK ALERT! ⚠️*\n\n` +
                        `*Product:* ${product.name}\n` +
                        `*Remaining Stock:* ${product.stock}\n` +
                        `*Category:* ${product.cat}\n\n` +
                        `Please restock: https://www.beautyinbalance.lk/admin`;

        for (const wpPhone of wpPhones) {
            // Option A: Green API
            if (greenApiId && greenApiToken) {
                const url = `https://api.green-api.com/waInstance${greenApiId}/sendMessage/${greenApiToken}`;
                await axios.post(url, {
                    chatId: `${wpPhone}@c.us`,
                    message: wpMessage
                });
                console.log(`💬 Low Stock Alert sent for ${product.name} to ${wpPhone}`);
            }
            // Option B: UltraMsg
            else if (ultraMsgInstance && ultraMsgToken) {
                const url = `https://api.ultramsg.com/${ultraMsgInstance}/messages/chat`;
                await axios.post(url, {
                    token: ultraMsgToken,
                    to: wpPhone,
                    body: wpMessage
                });
                console.log(`💬 Low Stock Alert sent for ${product.name} to ${wpPhone}`);
            }
            // Option C: CallMeBot
            else if (wpApiKey) {
                const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(wpPhone)}&text=${encodeURIComponent(wpMessage)}&apikey=${encodeURIComponent(wpApiKey)}`;
                await axios.get(url);
                console.log(`💬 Low Stock Alert sent for ${product.name} to ${wpPhone}`);
            }
        }
    } catch (err) {
        console.error("❌ Failed to send low stock alert:", err.message);
    }
};

module.exports = router;
