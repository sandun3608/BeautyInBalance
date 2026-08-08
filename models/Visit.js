const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    page: { type: String, required: true },
    ip: { type: String },
    userAgent: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Visit', visitSchema);
