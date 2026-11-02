const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const { protect } = require('../middleware/auth');

// Default settings dictionary
const defaults = { 
  shippingFee: 350,
  home_brand_order: [
    'ordinary', 
    'cerave', 
    'vaseline', 
    'manee', 
    'cool-vita', 
    'celimax', 
    'centellian24', 
    'cosrx', 
    'dr. rashel', 
    'perfectil', 
    'la roche-posay'
  ]
};

// GET /api/settings/:key — public read
router.get('/:key', async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    if (!setting) {
      return res.json({ key: req.params.key, value: defaults[req.params.key] ?? null });
    }
    res.json({ key: setting.key, value: setting.value });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching setting' });
  }
});

// PUT /api/settings/:key — admin only
router.put('/:key', protect, async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Admin only' });
    const { value } = req.body;
    const setting = await Setting.findOneAndUpdate(
      { key: req.params.key },
      { value },
      { upsert: true, new: true }
    );
    res.json({ key: setting.key, value: setting.value });
  } catch (err) {
    res.status(500).json({ message: 'Error saving setting' });
  }
});

module.exports = router;
