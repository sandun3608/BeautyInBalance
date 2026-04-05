const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Inquiry = require('../models/Inquiry');
const { protect } = require('../middleware/auth');

// @route   POST /api/inquiries
// @desc    Send a new inquiry from Contact page
// @access  Public
router.post('/', async (req, res) => {
    try {
        const inquiry = new Inquiry(req.body);
        const savedInquiry = await inquiry.save();
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
