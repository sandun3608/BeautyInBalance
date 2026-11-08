const axios = require('axios');

const sendEmail = async (options) => {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
        console.error("❌ Resend API Key is missing! Please configure RESEND_API_KEY.");
        throw new Error("Resend API Key is not configured in Environment Variables");
    }

    try {
        // If they verified their domain, process.env.EMAIL_USER (support@beautyinbalance.lk) will be used as sender.
        // Otherwise, onboarding@resend.dev can be used for initial testing.
        const fromEmail = process.env.EMAIL_USER || 'onboarding@resend.dev';

        const response = await axios.post('https://api.resend.com/emails', {
            from: `Beauty in Balance <${fromEmail}>`,
            to: [options.email],
            subject: options.subject,
            html: options.html || options.message
        }, {
            headers: {
                'Authorization': `Bearer ${resendApiKey.trim()}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("✅ Email sent successfully via Resend API (HTTPS):", response.data.id);
        return response.data;
    } catch (error) {
        const errorData = error.response ? JSON.stringify(error.response.data) : error.message;
        console.error("❌ Resend API Error:", errorData);
        throw new Error(`Resend sending failed: ${errorData}`);
    }
};

/**
 * Send order confirmation emails to both Admin and Customer.
 * Guards against duplicate sends using order.isEmailSent.
 */
const sendOrderConfirmation = async (order) => {
    if (!order || !order.customerInfo) {
        console.warn("⚠️ sendOrderConfirmation: Missing order or customer info");
        return;
    }

    // Atomic guard: check and set isEmailSent in MongoDB to prevent duplicate emails
    const Order = require('../models/Order');
    try {
        const existing = await Order.findById(order._id);
        if (existing && existing.isEmailSent) {
            console.log(`ℹ️ Confirmation email already sent for order ${order._id}`);
            return;
        }
        if (existing) {
            existing.isEmailSent = true;
            await existing.save();
        }
        order.isEmailSent = true;
    } catch (dbErr) {
        if (order.isEmailSent) {
            console.log(`ℹ️ Confirmation email already marked sent for order ${order._id}`);
            return;
        }
        order.isEmailSent = true;
    }

    if (!process.env.RESEND_API_KEY && !(process.env.EMAIL_USER && (process.env.GOOGLE_CLIENT_ID || process.env.EMAIL_PASS))) {
        console.warn("⚠️ No email configuration found. Skipping order confirmation email dispatch.");
        return;
    }

    try {
        const orderIdShort = order._id.toString().slice(-6).toUpperCase();
        const customerName = `${order.customerInfo?.firstName || 'Customer'} ${order.customerInfo?.lastName || ''}`.trim();
        const itemsList = (order.orderItems || []).map(i => `<li>${i.qty}x ${i.name} - Rs. ${Number(i.price).toLocaleString()}</li>`).join('');
        const paymentStatusText = order.isPaid ? 'PAID ✅' : 'PENDING / UNPAID ⏳';

        // 1. Notify Admin (Background)
        const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
        if (adminEmail) {
            sendEmail({
                email: adminEmail,
                subject: `🛍️ New Order Received! #${orderIdShort}`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #b58646;">New Order Notification</h2>
                        <p>You have received a new order from <strong>${customerName}</strong>.</p>
                        <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Details</h3>
                        <ul>${itemsList}</ul>
                        <p><strong>Total Price:</strong> Rs. ${Number(order.totalPrice).toLocaleString()}</p>
                        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
                        <p><strong>Payment Status:</strong> ${paymentStatusText}</p>
                        <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">Customer Contact</h3>
                        <p><strong>Email:</strong> ${order.customerInfo.email || 'N/A'}</p>
                        <p><strong>Phone:</strong> ${order.customerInfo.phone || 'N/A'}</p>
                        <p><strong>Address:</strong> ${order.customerInfo.address || ''}, ${order.customerInfo.city || ''}</p>
                    </div>
                `
            }).then(() => console.log(`📧 Admin notified for order ${order._id}`))
              .catch(err => console.error("📧 Admin email error:", err.message || err));
        }

        // 2. Notify Customer (Background)
        if (order.customerInfo.email) {
            sendEmail({
                email: order.customerInfo.email,
                subject: `Confirmation: Your Beauty in Balance Order #${orderIdShort}`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #b58646; text-align: center;">Thank You for Your Order!</h1>
                        <p>Hi ${order.customerInfo.firstName || 'Customer'},</p>
                        <p>We've received your order and are getting it ready for shipment.</p>
                        <div style="background: #fdfbf7; padding: 20px; border-radius: 10px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #1b1b1e;">Order Summary</h3>
                            <ul style="list-style: none; padding: 0;">
                                ${(order.orderItems || []).map(i => `
                                    <li style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
                                        <span>${i.qty}x ${i.name}</span>
                                        <span style="font-weight: bold;">Rs. ${(Number(i.price) * (i.qty || 1)).toLocaleString()}</span>
                                    </li>
                                `).join('')}
                            </ul>
                            <div style="display: flex; justify-content: space-between; padding-top: 15px; font-weight: bold; font-size: 18px;">
                                <span>Total</span>
                                <span style="color: #b58646;">Rs. ${Number(order.totalPrice).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                `
            }).then(() => console.log(`📧 Customer notified for order ${order._id}`))
              .catch(err => console.error("📧 Customer email error:", err.message || err));
        }
    } catch (emailBuildErr) {
        console.error("❌ Failed to build order confirmation email:", emailBuildErr);
    }
};

sendEmail.sendEmail = sendEmail;
sendEmail.sendOrderConfirmation = sendOrderConfirmation;

module.exports = sendEmail;
