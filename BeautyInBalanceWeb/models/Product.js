const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    cat: { type: String, required: true },
    filter: { type: String, required: false },
    price: { type: Number, required: true, default: 0 },
    img: { type: String, required: true },
    images: { type: [String], required: false },
    stock: { type: Number, required: true, default: 0 },
    desc: { type: String, required: false },
    benefits: { type: [String], required: false },
    howToUse: { type: String, required: false },
    authenticity: { type: String, required: false },
    id: { type: String, required: false, unique: true },
    discount: { type: Number, default: 0 } // Percentage discount
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
