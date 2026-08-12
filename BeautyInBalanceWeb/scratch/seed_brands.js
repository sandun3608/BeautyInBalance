const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables just in case
const Brand = require('../models/Brand');

// We need the mongo URI from server.js or .env
// We'll extract it from config.js or try a default one
let uri = 'mongodb+srv://sandunlakshitha222:Wn3cT6nZc23i1h66@cluster0.b9c8t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function seed() {
    try {
        await mongoose.connect(uri, { family: 4 });
        console.log('Connected to DB');

        const existing = await Brand.countDocuments();
        if (existing === 0) {
            const brandsToSeed = [
                { name: 'The Ordinary', image: 'brand/1.png', order: 1 },
                { name: 'CeraVe', image: 'brand/2.png', order: 2 },
                { name: 'Beauty of Joseon', image: 'brand/3.png', order: 3 },
                { name: 'Skin1004', image: 'brand/4.png', order: 4 },
                { name: 'Cetaphil', image: 'brand/5.png', order: 5 },
                { name: 'Dr. Althea', image: 'brand/6.png', order: 6 }
            ];
            await Brand.insertMany(brandsToSeed);
            console.log('Successfully seeded 6 brands!');
        } else {
            console.log('Brands already exist in DB. Skipping seed.');
        }
    } catch (e) {
        console.error('Error seeding brands:', e);
    } finally {
        mongoose.disconnect();
    }
}

seed();
