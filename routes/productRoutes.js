const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// @route   GET /api/products
router.get('/', async (req, res) => {
    try {
        // If DB is not connected, jump to fallback immediately
        if (mongoose.connection.readyState !== 1) {
            throw new Error("DB not connected");
        }
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error("GET Products ERROR:", error.message);
        try {
            const local = require('../extracted_products');
            res.status(200).json(local);
        } catch (e) {
            res.status(500).json({ message: 'DB offline & fallback failed!' });
        }
    }
});

// @route   GET /api/products/set-all-discounts-12
router.get('/set-all-discounts-12', async (req, res) => {
    try {
        const result = await Product.updateMany({}, { $set: { discount: 12 } });
        res.json({ message: 'SUCCESS! Updated all products to 12% discount.', updatedCount: result.modifiedCount });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update discounts!', error: err.message });
    }
});

// ⚡ IMPORTANT: /seed-now MUST BE BEFORE /:id or Express matches "seed-now" as an :id
// @route   GET /api/products/seed-now (NUCLEAR RESET 🔥)
router.get('/seed-now', async (req, res) => {
    try {
        console.log("🔥 NUCLEAR RESET TRIGGERED! PURGING CLOUD DB...");
        const seed = require('../extracted_products');
        await Product.deleteMany({});
        const result = await Product.insertMany(seed.map(p => ({ ...p, stock: p.stock || 50, discount: p.discount || 0 })));
        res.json({ message: 'CLOUD DB FULLY RESET & RE-SEEDED!', count: result.length });
    } catch (err) {
        res.status(500).json({ message: 'Reset Failed!', error: err.message });
    }
});

// @route   GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        let p;
        if (mongoose.Types.ObjectId.isValid(req.params.id)) p = await Product.findById(req.params.id);
        if (!p) p = await Product.findOne({ id: req.params.id });

        if (p) res.json(p);
        else res.status(404).json({ message: 'Product Not Found in DB!' });
    } catch (e) {
        res.status(500).json({ message: 'Server Fetch Error.' });
    }
});

// @route   POST /api/products
router.post('/', protect, async (req, res) => {
    try {
        console.log("--- ATTEMPTING TO SAVE PRODUCT ---");
        console.log("Name:", req.body.name);
        
        let customId = req.body.id || 'p-' + Date.now();
        const exists = await Product.findOne({ id: customId });
        if (exists) customId += '-' + Math.floor(Math.random() * 1000);

        const newP = new Product({
            name: req.body.name,
            cat: req.body.cat || 'others',
            filter: req.body.filter || '',
            price: Number(req.body.price) || 0,
            img: req.body.img,
            images: req.body.images || [req.body.img],
            stock: Number(req.body.stock) || 50,
            desc: req.body.desc || '',
            benefits: req.body.benefits || [],
            howToUse: req.body.howToUse || '',
            authenticity: req.body.authenticity || 'Genuine Import',
            id: customId,
            discount: Number(req.body.discount) || 0
        });

        const saved = await newP.save();
        console.log("✅ PRODUCT SAVED SUCCESSFULLY!");
        res.status(201).json(saved);
    } catch (err) {
        console.error("❌ CREATE PRODUCT ERROR:", err.message);
        res.status(400).json({ message: 'Database Save Failed: ' + err.message });
    }
});

// @route   PUT /api/products/:id
router.put('/:id', protect, async (req, res) => {
    try {
        let p;
        if (mongoose.Types.ObjectId.isValid(req.params.id)) p = await Product.findById(req.params.id);
        if (!p) p = await Product.findOne({ id: req.params.id });

        if (p) {
            Object.assign(p, req.body);
            if(req.body.price) p.price = Number(req.body.price);
            if(req.body.stock) p.stock = Number(req.body.stock);
            if(req.body.discount) p.discount = Number(req.body.discount);
            
            const updated = await p.save();
            res.json(updated);
        } else {
            res.status(404).json({ message: 'Product not found to update!' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Update failed midway: ' + err.message });
    }
});

// @route   DELETE /api/products/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        let p;
        if (mongoose.Types.ObjectId.isValid(req.params.id)) p = await Product.findById(req.params.id);
        if (!p) p = await Product.findOne({ id: req.params.id });
        
        if (p) {
            await p.deleteOne();
            res.json({ message: 'Product erased forever!' });
        } else {
            res.status(404).json({ message: 'Product not found!' });
        }
    } catch (e) {
        res.status(500).json({ message: 'Delete failed.' });
    }
});

// @route   DELETE /api/products/category/:cat
router.delete('/category/:cat', protect, async (req, res) => {
    try {
        const catName = req.params.cat;
        const result = await Product.deleteMany({ cat: new RegExp(`^${catName}$`, 'i') });
        res.json({ message: `Deleted ${result.deletedCount} products from category ${catName}` });
    } catch (e) {
        res.status(500).json({ message: 'Category delete failed.' });
    }
});

module.exports = router;
