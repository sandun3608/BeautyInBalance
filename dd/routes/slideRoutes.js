const express = require('express');
const router = express.Router();
const Slide = require('../models/Slide');

// Get all slides
router.get('/', async (req, res) => {
    try {
        const slides = await Slide.find().sort({ createdAt: 1 });
        res.json(slides);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new slide
router.post('/', async (req, res) => {
    try {
        const newSlide = new Slide(req.body);
        const savedSlide = await newSlide.save();
        res.status(201).json(savedSlide);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a slide
router.delete('/:id', async (req, res) => {
    try {
        const deletedSlide = await Slide.findOneAndDelete({ id: req.params.id });
        if (!deletedSlide) {
            return res.status(404).json({ error: 'Slide not found' });
        }
        res.json({ message: 'Slide deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
