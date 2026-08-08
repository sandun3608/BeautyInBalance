const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');
const Subscriber = require('../models/Subscriber');
const { protect } = require('../middleware/auth');

// @route   POST /api/subscribers
// @desc    Register a new email for newsletter / subscription
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email address is required.' });
        }

        // Check if already subscribed
        const existing = await Subscriber.findOne({ email });
        if (existing) {
            return res.status(200).json({ message: 'You are already subscribed!', alreadySubscribed: true });
        }

        const subscriber = new Subscriber({ email });
        const savedSubscriber = await subscriber.save();

        // --- WHATSAPP NOTIFICATION ---
        const rawWpPhone = process.env.WHATSAPP_PHONE;
        const wpPhone = rawWpPhone ? rawWpPhone.replace(/[^0-9]/g, '') : null;
        const greenApiId = process.env.GREEN_API_ID_INSTANCE;
        const greenApiToken = process.env.GREEN_API_TOKEN_INSTANCE;
        const ultraMsgInstance = process.env.ULTRAMSG_INSTANCE_ID;
        const ultraMsgToken = process.env.ULTRAMSG_TOKEN;
        const wpApiKey = process.env.WHATSAPP_API_KEY;

        if (wpPhone) {
            let wpMessage = `*📧 New Newsletter Subscriber!*\n\n` +
                            `*Email:* ${email}\n\n` +
                            `Check details: https://www.beautyinbalance.lk/admin`;

            // Option A: Green API Integration
            if (greenApiId && greenApiToken) {
                const url = `https://api.green-api.com/waInstance${greenApiId}/sendMessage/${greenApiToken}`;
                axios.post(url, {
                    chatId: `${wpPhone}@c.us`,
                    message: wpMessage
                })
                .then(() => console.log(`💬 Green API WhatsApp subscriber notification sent`))
                .catch(err => console.error("❌ Green API subscriber notification failed:", err.message));
            }
            // Option B: UltraMsg Integration
            else if (ultraMsgInstance && ultraMsgToken) {
                const url = `https://api.ultramsg.com/${ultraMsgInstance}/messages/chat`;
                axios.post(url, {
                    token: ultraMsgToken,
                    to: wpPhone,
                    body: wpMessage
                })
                .then(() => console.log(`💬 UltraMsg WhatsApp subscriber notification sent`))
                .catch(err => console.error("❌ UltraMsg subscriber notification failed:", err.message));
            }
            // Option C: CallMeBot Integration (Fallback)
            else if (wpApiKey) {
                const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(wpPhone)}&text=${encodeURIComponent(wpMessage)}&apikey=${encodeURIComponent(wpApiKey)}`;
                axios.get(url)
                .then(() => console.log(`💬 CallMeBot WhatsApp subscriber notification sent`))
                .catch(err => console.error("❌ CallMeBot subscriber notification failed:", err.message));
            }
        }
        res.status(201).json(savedSubscriber);
    } catch (error) {
        console.error("Subscriber save error:", error);
        res.status(500).json({ message: 'Failed to subscribe. Please try again.' });
    }
});

// @route   GET /api/subscribers
// @desc    Get all subscribers for Admin dashboard
// @access  Private (Admin)
router.get('/', protect, async (req, res) => {
    try {
        const subscribers = await Subscriber.find({}).sort({ createdAt: -1 });
        res.json(subscribers);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching subscribers.' });
    }
});

// @route   DELETE /api/subscribers/:id
// @desc    Delete a subscriber (Admin)
// @access  Private (Admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid Subscriber ID' });
        }

        const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
        if (subscriber) {
            res.json({ message: 'Subscriber deleted successfully.' });
        } else {
            res.status(404).json({ message: 'Subscriber not found.' });
        }
    } catch (error) {
        console.error("Subscriber delete error:", error);
        res.status(500).json({ message: 'Server error deleting subscriber.' });
    }
});

module.exports = router;
