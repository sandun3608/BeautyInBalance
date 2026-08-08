const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  desktopImage: { type: String, required: true },  // base64 image data
  mobileImage: { type: String, default: '' },       // base64 image data (optional, falls back to desktop)
  title: { type: String, default: 'New Slide' },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  buttonText: { type: String, default: 'SHOP NOW' },
  buttonLink: { type: String, default: 'shop.html' },
  pills: [{ type: String }],                        // e.g. ['CLEANSER', 'SERUM']
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Slide', slideSchema);
