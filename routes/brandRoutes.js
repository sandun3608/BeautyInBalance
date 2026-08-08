const express = require('express');
const router = express.Router();
const Brand = require('../models/Brand');
const { verifyAdmin } = require('../middleware/auth');

// Get all active brands (public)
router.get('/', async (req, res) => {
    try {
        const brands = await Brand.find({ isActive: true }).sort('order');
        res.json(brands);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all brands (admin)
router.get('/all', verifyAdmin, async (req, res) => {
    try {
        const brands = await Brand.find().sort('order');
        res.json(brands);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create brand (admin)
router.post('/', verifyAdmin, async (req, res) => {
    try {
        const brand = new Brand(req.body);
        const savedBrand = await brand.save();
        res.status(201).json(savedBrand);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update brand (admin)
router.put('/:id', verifyAdmin, async (req, res) => {
    try {
        const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!brand) return res.status(404).json({ message: 'Brand not found' });
        res.json(brand);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete brand (admin)
router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
        const brand = await Brand.findByIdAndDelete(req.params.id);
        if (!brand) return res.status(404).json({ message: 'Brand not found' });
        res.json({ message: 'Brand deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
