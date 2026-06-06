const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
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
