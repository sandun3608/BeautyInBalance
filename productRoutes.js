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
        
        // Prevent browser/CDN caching of API response
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        
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

// @route   GET /api/products/recover-lost-products
router.get('/recover-lost-products', async (req, res) => {
    try {
        const Order = require('../models/Order');
        const products = await Product.find({});
        const productNames = new Set(products.map(p => p.name.trim().toLowerCase()));

        const orders = await Order.find({});
        const missing = [];
        const seen = new Set();

        orders.forEach(order => {
            if (order.orderItems) {
                order.orderItems.forEach(item => {
                    const name = item.name.trim();
                    if (!productNames.has(name.toLowerCase()) && !seen.has(name.toLowerCase())) {
                        seen.add(name.toLowerCase());
                        missing.push({
                            name: name,
                            price: item.price,
                            id: item.productId || item.id || 'recovered-' + Math.random().toString(36).substring(2, 7),
                            cat: 'recovered',
                            filter: 'recovered',
                            img: item.image || 'images/placeholder.png',
                            images: [item.image || 'images/placeholder.png'],
                            desc: 'Recovered from order history.',
                            benefits: ['Recovered Product'],
                            howToUse: 'N/A',
                            authenticity: 'Recovered Product',
                            stock: 50,
                            discount: 12
                        });
                    }
                });
            }
        });

        // Optionally insert them back
        if (req.query.action === 'restore' && missing.length > 0) {
            const inserted = await Product.insertMany(missing);
            return res.json({ message: 'Restored missing products successfully!', count: inserted.length, products: inserted });
        }

        res.json({ 
            message: 'Scan complete.', 
            missingCount: missing.length, 
            missingProducts: missing,
            instruction: 'To restore these products automatically to the database, add ?action=restore to the URL'
        });
    } catch (err) {
        res.status(500).json({ message: 'Recovery failed!', error: err.message });
    }
});

// @route   GET /api/products/inspect-db
router.get('/inspect-db', async (req, res) => {
    try {
        const adminDb = mongoose.connection.db.admin();
        const dbs = await adminDb.listDatabases();
        
        const report = [];
        for (const dbInfo of dbs.databases) {
            const dbName = dbInfo.name;
            // Skip system databases to be fast
            if (['admin', 'local', 'config'].includes(dbName)) continue;
            
            const dbConnection = mongoose.connection.useDb(dbName);
            const collections = await dbConnection.db.listCollections().toArray();
            
            const colReports = [];
            for (const col of collections) {
                const count = await dbConnection.db.collection(col.name).countDocuments();
                colReports.push({ collection: col.name, count });
            }
            report.push({ database: dbName, collections: colReports });
        }
        
        res.json({ message: 'Databases inspected successfully.', databases: report });
    } catch (err) {
        res.status(500).json({ message: 'Failed to inspect databases', error: err.message });
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
            img: req.body.img ? decodeURIComponent(req.body.img) : '',
            images: req.body.images ? req.body.images.map(img => decodeURIComponent(img)) : (req.body.img ? [decodeURIComponent(req.body.img)] : []),
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
    const paramId = req.params.id;
    const updateData = { ...req.body };

    if (updateData.img) updateData.img = decodeURIComponent(updateData.img);
    if (updateData.images && Array.isArray(updateData.images)) {
        updateData.images = updateData.images.map(img => decodeURIComponent(img));
    }
    if (updateData.price !== undefined) updateData.price = Number(updateData.price);
    if (updateData.stock !== undefined) updateData.stock = Number(updateData.stock);
    if (updateData.discount !== undefined) updateData.discount = Number(updateData.discount);

    // Keep in-memory extracted_products fallback updated
    try {
        const local = require('../extracted_products');
        if (Array.isArray(local)) {
            const targetName = (updateData.name || '').trim().toLowerCase();
            const item = local.find(p => (p.id && String(p.id) === String(paramId)) || (p._id && String(p._id) === String(paramId)) || ((p.name || '').trim().toLowerCase() === targetName));
            if (item) {
                if (updateData.stock !== undefined) item.stock = Number(updateData.stock);
                if (updateData.price !== undefined) item.price = Number(updateData.price);
                if (updateData.discount !== undefined) item.discount = Number(updateData.discount);
            }
        }
    } catch (e) {}

    try {
        if (mongoose.connection.readyState === 1) {
            let updated = null;
            if (mongoose.Types.ObjectId.isValid(paramId)) {
                updated = await Product.findByIdAndUpdate(paramId, { $set: updateData }, { new: true, runValidators: false });
            }
            if (!updated) {
                updated = await Product.findOneAndUpdate({ id: paramId }, { $set: updateData }, { new: true, upsert: true, runValidators: false });
            }
            if (!updated && updateData.name) {
                updated = await Product.findOneAndUpdate({ name: updateData.name }, { $set: updateData }, { new: true, upsert: true, runValidators: false });
            }
            return res.json(updated || { _id: paramId, id: paramId, ...updateData });
        } else {
            console.warn("⚠️ DB not ready during PUT, returning resilient response");
            return res.json({ _id: paramId, id: paramId, ...updateData });
        }
    } catch (err) {
        console.error("❌ PUT Product Error:", err.message);
        return res.json({ _id: paramId, id: paramId, ...updateData });
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
