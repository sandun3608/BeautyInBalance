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
            const siteUrl = process.env.SITE_URL || 'https://www.beautyinbalance.lk';
            const customerFullName = `${order.customerInfo?.firstName || 'Valued Customer'} ${order.customerInfo?.lastName || ''}`.trim();
            const orderItemsRows = (order.orderItems || []).map(i => `
                <tr>
                    <td style="padding: 10px 0; color: #4A4440; font-size: 14px; border-bottom: 1px dashed #EDE5D9;">
                        <span style="font-weight: 700; color: #2D2727;">${i.qty}x</span> ${i.name}
                    </td>
                    <td style="padding: 10px 0; text-align: right; font-weight: 700; color: #2D2727; font-size: 14px; border-bottom: 1px dashed #EDE5D9; white-space: nowrap;">
                        Rs. ${(Number(i.price) * (i.qty || 1)).toLocaleString()}
                    </td>
                </tr>
            `).join('');

            sendEmail({
                email: order.customerInfo.email,
                subject: `Confirmation: Your Beauty in Balance Order #${orderIdShort} 💖✨`,
                html: `
                    <div style="background-color: #FAF6F0; padding: 25px 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #F0E8DD;">
                            
                            <!-- Aesthetic Thank You Banner Image -->
                            <div style="background: #FDFBF7; text-align: center;">
                                <img src="${siteUrl}/thank-you-banner.jpg" alt="Thank You ❤️ Beauty in Balance" style="width: 100%; max-width: 600px; height: auto; display: block;" />
                            </div>

                            <!-- Main Content Card -->
                            <div style="padding: 30px 25px;">
                                
                                <!-- Status Badge -->
                                <div style="text-align: center; margin-bottom: 18px;">
                                    <span style="display: inline-block; background: #FFF4E5; color: #B58646; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 6px 18px; border-radius: 30px; border: 1px solid #F5DDC2;">
                                        ✨ Order Confirmed 💖
                                    </span>
                                </div>

                                <!-- Title -->
                                <h1 style="color: #2D2727; font-size: 24px; font-weight: 700; text-align: center; margin: 0 0 8px 0; letter-spacing: 0.3px;">
                                    Thank You for Your Order! 💖✨
                                </h1>
                                <p style="text-align: center; color: #9A8D85; font-size: 13px; margin: 0 0 25px 0;">
                                    Handcrafted & Packed with Love ❤️ • Getting Ready for Shipment
                                </p>

                                <!-- Greeting -->
                                <p style="font-size: 15px; color: #4A4440; line-height: 1.6; margin: 0 0 12px 0;">
                                    Hi <strong>${customerFullName}</strong>,
                                </p>
                                <p style="font-size: 15px; color: #554F4B; line-height: 1.7; margin: 0 0 25px 0;">
                                    Thank you so much for choosing Beauty in Balance! 💕 We've received your order <span style="background: #FAF0E6; color: #B58646; padding: 2px 8px; border-radius: 6px; font-weight: 700;">#${orderIdShort}</span> and our team is already getting it lovingly packed and ready for delivery.
                                </p>

                                <!-- Order Summary Card -->
                                <div style="background: #FDFBF7; border: 1px solid #EFE8DE; border-radius: 14px; padding: 20px 22px; margin-bottom: 25px;">
                                    <div style="border-bottom: 1px solid #ECE3D6; padding-bottom: 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
                                        <span style="font-size: 15px; font-weight: 700; color: #2D2727;">🛍️ Order Summary</span>
                                        <span style="font-size: 12px; font-weight: 700; color: #B58646;">#${orderIdShort}</span>
                                    </div>
                                    
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tbody>
                                            ${orderItemsRows}
                                        </tbody>
                                    </table>

                                    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 15px; margin-top: 10px; border-top: 1px solid #ECE3D6; font-size: 15px;">
                                        <span style="font-weight: 700; color: #2D2727;">Total</span>
                                        <span style="font-weight: 800; color: #B58646; font-size: 18px;">Rs. ${Number(order.totalPrice).toLocaleString()}</span>
                                    </div>

                                    <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed #EDE5D9; font-size: 13px; color: #777;">
                                        <span>Payment: <strong>${order.paymentMethod || 'Cash on Delivery'}</strong></span> • 
                                        <span>Status: <strong style="color: ${order.isPaid ? '#10b981' : '#d97706'};">${paymentStatusText}</strong></span>
                                    </div>
                                </div>

                                <!-- Aesthetic Love & Thank You Box -->
                                <div style="background: #FFF9F8; border: 1px dashed #F2C7C4; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 25px;">
                                    <div style="font-size: 24px; margin-bottom: 8px;">💖 🌸 💖</div>
                                    <p style="margin: 0; color: #A45053; font-weight: 700; font-size: 16px;">
                                        Thank You for Choosing Beauty in Balance!
                                    </p>
                                    <p style="margin: 6px 0 0 0; color: #7A6665; font-size: 13px; line-height: 1.6;">
                                        Every product is curated with care to help your natural radiance shine. We can't wait for you to experience your new skincare treats! ✨❤️
                                    </p>
                                </div>

                                <!-- Footer / Need Help -->
                                <div style="text-align: center; border-top: 1px solid #EFE8DE; padding-top: 20px; color: #8F847D; font-size: 12px; line-height: 1.6;">
                                    <p style="margin: 0 0 6px 0;">
                                        Have questions about your order? We are always here for you! 💕
                                    </p>
                                    <p style="margin: 0 0 15px 0;">
                                        Contact us at <a href="mailto:${process.env.EMAIL_USER || 'support@beautyinbalance.lk'}" style="color: #B58646; text-decoration: underline; font-weight: 700;">${process.env.EMAIL_USER || 'support@beautyinbalance.lk'}</a>
                                    </p>
                                    <p style="margin: 0; font-size: 11px; color: #B0A59E;">
                                        © ${new Date().getFullYear()} Beauty in Balance. Handcrafted with love ❤️ for your skin.
                                    </p>
                                </div>

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
