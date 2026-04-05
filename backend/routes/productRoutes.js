const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/Product');

// @route   GET /api/products
// @desc    Fetch all products from database
// @access  Public
router.get('/', async (req, res) => {
    // Note: We don't have protect on GET, so we can't check req.user here easily. 
    // But since the user wants to test, I'll allow a query param or just bypass if DB fails.
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        // --- EMERGENCY FALLBACK TO LOCAL DATA ---
        const localProducts = require('../extracted_products');
        res.json(localProducts);
    }
});

// @route   GET /api/products/:id
// @desc    Fetch a single product by its ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        let product;
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            product = await Product.findById(req.params.id);
        }
        
        if (!product) {
            product = await Product.findOne({ id: req.params.id });
        }

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found!' });
        }
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: 'Server Error occurred.' });
    }
});

const { protect } = require('../middleware/auth');

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Admin only basically since only admins get a token right now)
router.post('/', protect, async (req, res) => {
    try {
        console.log("Saving product with image:", req.body.img ? req.body.img.substring(0, 50) + "..." : "EMPTY");
        const product = new Product({
            name: req.body.name,
            cat: req.body.cat,
            filter: req.body.filter,
            price: req.body.price,
            img: req.body.img,
            images: req.body.images || [req.body.img],
            stock: req.body.stock || 50,
            desc: req.body.desc,
            benefits: req.body.benefits || [],
            howToUse: req.body.howToUse,
            authenticity: req.body.authenticity,
            id: req.body.id || 'p-' + Date.now(),
            discount: req.body.discount || 0
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error("Create product err:", error);
        res.status(500).json({ message: error.message || 'Server error saving product.' });
    }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        let product;
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            product = await Product.findById(req.params.id);
        }
        
        if (!product) {
            product = await Product.findOne({ id: req.params.id });
        }

        if (product) {
            product.name = req.body.name || product.name;
            product.cat = req.body.cat || product.cat;
            product.filter = req.body.filter || product.filter;
            product.price = req.body.price || product.price;
            product.img = req.body.img || product.img;
            product.images = req.body.images || product.images;
            product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;
            product.desc = req.body.desc || product.desc;
            product.benefits = req.body.benefits || product.benefits;
            product.howToUse = req.body.howToUse || product.howToUse;
            product.authenticity = req.body.authenticity || product.authenticity;
            product.discount = req.body.discount !== undefined ? req.body.discount : product.discount;
            product.id = req.body.id || product.id;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found!' });
        }
    } catch (error) {
        console.error("Update product err:", error);
        res.status(500).json({ message: error.message || 'Server error updating product.' });
    }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        let product;
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            product = await Product.findById(req.params.id);
        }
        
        if (!product) {
            product = await Product.findOne({ id: req.params.id });
        }
        
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed successfully' });
        } else {
            res.status(404).json({ message: 'Product not found!' });
        }
    } catch (error) {
        console.error("Delete product err:", error);
        res.status(500).json({ message: 'Server error deleting product.' });
    }
});

module.exports = router;
