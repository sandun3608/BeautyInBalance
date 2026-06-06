const express = require('express');
const router = express.Router();
const Slide = require('../models/Slide');
const { protect } = require('../middleware/auth');

// GET /api/slides — Public: fetch all active slides sorted by order
router.get('/', async (req, res) => {
  try {
    const slides = await Slide.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(slides);
  } catch (err) {
    console.error('Error fetching slides:', err.message);
    res.status(500).json({ message: 'Error fetching slides' });
  }
});

// GET /api/slides/all — Admin only: fetch ALL slides (including inactive)
router.get('/all', protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin only' });
    const slides = await Slide.find().sort({ order: 1, createdAt: -1 });
    res.json(slides);
  } catch (err) {
    console.error('Error fetching all slides:', err.message);
    res.status(500).json({ message: 'Error fetching slides' });
  }
});

// POST /api/slides — Admin only: create a new slide
router.post('/', protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin only' });

    const { desktopImage, mobileImage, title, subtitle, description, buttonText, buttonLink, pills, order, isActive } = req.body;

    if (!desktopImage) {
      return res.status(400).json({ message: 'Desktop image is required' });
    }

    // Auto-assign order if not provided
    let slideOrder = order;
    if (slideOrder === undefined || slideOrder === null) {
      const lastSlide = await Slide.findOne().sort({ order: -1 });
      slideOrder = lastSlide ? lastSlide.order + 1 : 0;
    }

    const slide = await Slide.create({
      desktopImage,
      mobileImage: mobileImage || '',
      title: title || 'New Slide',
      subtitle: subtitle || '',
      description: description || '',
      buttonText: buttonText || 'SHOP NOW',
      buttonLink: buttonLink || 'shop.html',
      pills: pills || [],
      order: slideOrder,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json(slide);
  } catch (err) {
    console.error('Error creating slide:', err.message);
    res.status(500).json({ message: 'Error creating slide' });
  }
});

// PUT /api/slides/:id — Admin only: update a slide
router.put('/:id', protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin only' });

    const slide = await Slide.findById(req.params.id);
    if (!slide) return res.status(404).json({ message: 'Slide not found' });

    const { desktopImage, mobileImage, title, subtitle, description, buttonText, buttonLink, pills, order, isActive } = req.body;

    if (desktopImage !== undefined) slide.desktopImage = desktopImage;
    if (mobileImage !== undefined) slide.mobileImage = mobileImage;
    if (title !== undefined) slide.title = title;
    if (subtitle !== undefined) slide.subtitle = subtitle;
    if (description !== undefined) slide.description = description;
    if (buttonText !== undefined) slide.buttonText = buttonText;
    if (buttonLink !== undefined) slide.buttonLink = buttonLink;
    if (pills !== undefined) slide.pills = pills;
    if (order !== undefined) slide.order = order;
    if (isActive !== undefined) slide.isActive = isActive;

    const updated = await slide.save();
    res.json(updated);
  } catch (err) {
    console.error('Error updating slide:', err.message);
    res.status(500).json({ message: 'Error updating slide' });
  }
});

// DELETE /api/slides/:id — Admin only: delete a slide
router.delete('/:id', protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin only' });

    const slide = await Slide.findById(req.params.id);
    if (!slide) return res.status(404).json({ message: 'Slide not found' });

    await slide.deleteOne();
    res.json({ message: 'Slide deleted successfully' });
  } catch (err) {
    console.error('Error deleting slide:', err.message);
    res.status(500).json({ message: 'Error deleting slide' });
  }
});

module.exports = router;
