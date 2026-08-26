const mongoose = require('mongoose');

const SlideSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    desktopImgUrl: { type: String, required: true },
    mobileImgUrl: { type: String, required: true },
    title: { type: String, default: '' },
    desc: { type: String, default: '' },
    pills: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Slide', SlideSchema);
