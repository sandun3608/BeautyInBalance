require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const adminUser = {
    name: 'Master Admin',
    email: 'admin@beauty.com',
    password: 'admin123', // Will be hashed below
    isAdmin: true
};

mongoose.connect(process.env.MONGO_URI, {
    family: 4,
    tlsAllowInvalidCertificates: true,
    serverSelectionTimeoutMS: 5000
}).then(async () => {
    console.log('MongoDB connected for Admin Setup...');
    
    // Check if the admin already exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    
    if (existingAdmin) {
        console.log('Master Admin already exists! Skipping creation.');
        process.exit();
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminUser.password, salt);
    adminUser.password = hashedPassword;
    
    // Create the admin
    await User.create(adminUser);
    console.log('Successfully created Master Admin Account => admin@beauty.com / admin123');
    process.exit();
}).catch((err) => {
    console.error(err);
    process.exit(1);
});
