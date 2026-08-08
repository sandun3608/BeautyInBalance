const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { protect } = require('../middleware/auth');

// Helper to generate a token
const generateToken = (id) => {
    const secret = process.env.JWT_SECRET || 'beauty_in_balance_token_key_123';
    return jwt.sign({ id }, secret, { expiresIn: '30d' });
};

// @route   POST /api/users/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (email === 'nipuni@beauty.com' && password === 'BeautyAdmin@2026') {
        try {
            let admin = await User.findOne({ email: 'nipuni@beauty.com' });
            if (!admin) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('BeautyAdmin@2026', salt);
                admin = await User.create({
                    name: 'Nipuni',
                    email: 'nipuni@beauty.com',
                    password: hashedPassword,
                    isAdmin: true
                });
            }
            return res.json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                isAdmin: admin.isAdmin,
                avatar: admin.avatar || '',
                token: generateToken(admin._id),
            });
        } catch (err) {
            console.error("Admin auto-upsert failed:", err);
            // Fallback to dummy if DB fails
            const dummyId = '111111111111111111111111';
            return res.json({
                _id: dummyId,
                name: 'Nipuni',
                email: 'nipuni@beauty.com',
                isAdmin: true,
                avatar: '', 
                token: generateToken(dummyId),
            });
        }
    }

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar || '',
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during login' });
    }
});

// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        // 1. Check for emergency admin bypass ID first
        if (req.user && req.user._id === '111111111111111111111111') {
            return res.json({
                _id: '111111111111111111111111',
                name: req.body.name || 'Nipuni',
                email: 'nipuni@beauty.com',
                avatar: req.body.avatar || '',
                isAdmin: true,
                token: generateToken('111111111111111111111111'),
            });
        }

        let user = await User.findById(req.user._id);

        // If user not found but it's our admin email, create them
        if (!user && req.user.email === 'nipuni@beauty.com') {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('BeautyAdmin@2026', salt);
            user = new User({
                _id: req.user._id,
                name: req.body.name || 'Nipuni',
                email: 'nipuni@beauty.com',
                password: hashedPassword,
                isAdmin: true
            });
        }

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.avatar = req.body.avatar || user.avatar;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                avatar: updatedUser.avatar,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: 'Profile update failed: ' + error.message });
    }
});

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password securely so even the DB Admin can't read it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data received' });
        }
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

module.exports = router;
