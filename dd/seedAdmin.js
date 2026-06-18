require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');

const seedAdmin = async () => {
    try {
        const mongoURI = process.env.MONGO_URI.trim().replace(/^"(.*)"$/, '$1');
        await mongoose.connect(mongoURI);
        console.log('Connected to DB');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('BeautyAdmin@2026', salt);

        const adminData = {
            name: 'Nipuni',
            email: 'nipuni@beauty.com',
            password: hashedPassword,
            isAdmin: true
        };

        const existing = await User.findOne({ email: adminData.email });
        if (existing) {
            console.log('Admin already exists. Updating password/name.');
            existing.password = hashedPassword;
            existing.name = 'Nipuni';
            await existing.save();
        } else {
            await User.create(adminData);
            console.log('Admin created successfully.');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
