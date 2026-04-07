const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Allowing Guest Checkouts!
    },
    customerInfo: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        district: { type: String, required: true }
    },
    orderItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            price: { type: Number, required: true },
            product: { type: String, required: true } // Can be ID or name since some are old hardware-coded texts
        }
    ],
    shippingPrice: {
        type: Number,
        required: true,
        default: 0
    },
    paymentMethod: {
        type: String,
        required: true,
        default: 'Cash on Delivery'
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
