const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');
const Inquiry = require('../models/Inquiry');
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

// @route   POST /api/inquiries
// @desc    Send a new inquiry from Contact page
// @access  Public
router.post('/', async (req, res) => {
    try {
        const inquiry = new Inquiry(req.body);
        const savedInquiry = await inquiry.save();

        // --- EMAIL NOTIFICATION (BACKGROUND) ---
        if (process.env.EMAIL_USER && (process.env.EMAIL_PASS || process.env.GOOGLE_CLIENT_ID)) {
            const sendEmail = require('../utils/mailer');
            sendEmail({
                email: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
                subject: `✉️ New Client Inquiry: ${savedInquiry.name}`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #b58646;">New Message Received</h2>
                        <p><strong>From:</strong> ${savedInquiry.name} (${savedInquiry.email})</p>
                        <p><strong>Message:</strong></p>
                        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; font-style: italic;">
                            "${savedInquiry.message}"
                        </div>
                        <p style="margin-top: 20px; color: #777; font-size: 12px;">Received on: ${new Date().toLocaleString()}</p>
                    </div>
                `
            }).then(() => console.log("📧 Inquiry notification sent")).catch(err => console.error("📧 Inquiry email failed:", err));
        }

        // --- WHATSAPP NOTIFICATION ---
        const rawWpPhone = process.env.WHATSAPP_PHONE;
        const wpPhones = rawWpPhone ? rawWpPhone.split(',').map(p => formatWhatsAppPhone(p.trim())).filter(p => p) : [];
        const greenApiId = process.env.GREEN_API_ID_INSTANCE;
        const greenApiToken = process.env.GREEN_API_TOKEN_INSTANCE;
        const ultraMsgInstance = process.env.ULTRAMSG_INSTANCE_ID;
        const ultraMsgToken = process.env.ULTRAMSG_TOKEN;
        const wpApiKey = process.env.WHATSAPP_API_KEY;

        if (wpPhones.length > 0) {
            let wpMessage = `*✉️ New Customer Inquiry Received!*\n\n` +
                            `*Name:* ${savedInquiry.name}\n` +
                            `*Email:* ${savedInquiry.email || 'N/A'}\n` +
                            `*Message:* ${savedInquiry.message || 'N/A'}\n\n` +
                            `Check details: https://www.beautyinbalance.lk/admin`;

            for (const wpPhone of wpPhones) {
                // Option A: Green API Integration
                if (greenApiId && greenApiToken) {
                    const url = `https://api.green-api.com/waInstance${greenApiId}/sendMessage/${greenApiToken}`;
                    axios.post(url, {
                        chatId: `${wpPhone}@c.us`,
                        message: wpMessage
                    })
                    .then(() => console.log(`💬 Green API WhatsApp inquiry notification sent to ${wpPhone}`))
                    .catch(err => console.error(`❌ Green API inquiry notification failed for ${wpPhone}:`, err.message));
                }
                // Option B: UltraMsg Integration
                else if (ultraMsgInstance && ultraMsgToken) {
                    const url = `https://api.ultramsg.com/${ultraMsgInstance}/messages/chat`;
                    axios.post(url, {
                        token: ultraMsgToken,
                        to: wpPhone,
                        body: wpMessage
                    })
                    .then(() => console.log(`💬 UltraMsg WhatsApp inquiry notification sent to ${wpPhone}`))
                    .catch(err => console.error(`❌ UltraMsg inquiry notification failed for ${wpPhone}:`, err.message));
                }
                // Option C: CallMeBot Integration (Fallback)
                else if (wpApiKey) {
                    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(wpPhone)}&text=${encodeURIComponent(wpMessage)}&apikey=${encodeURIComponent(wpApiKey)}`;
                    axios.get(url)
                    .then(() => console.log(`💬 CallMeBot WhatsApp inquiry notification sent to ${wpPhone}`))
                    .catch(err => console.error(`❌ CallMeBot inquiry notification failed for ${wpPhone}:`, err.message));
                }
            }
        }

        res.status(201).json(savedInquiry);
    } catch (error) {
        console.error("Inquiry save error:", error);
        res.status(500).json({ message: 'Failed to send inquiry' });
    }
});

// @route   GET /api/inquiries
// @desc    Get all inquiries for Admin
// @access  Private (Admin)
router.get('/', protect, async (req, res) => {
    try {
        const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching inquiries' });
    }
});

// @route   PUT /api/inquiries/:id/read
// @desc    Mark inquiry as read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Inquiry ID format' });
        }

        const inquiry = await Inquiry.findById(req.params.id);
        if (inquiry) {
            inquiry.isRead = true;
            await inquiry.save();
            res.json({ message: 'Marked as read' });
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (error) {
        console.error("Inquiry mark read error:", error);
        res.status(500).json({ message: 'Server error marking inquiry as read' });
    }
});

module.exports = router;
