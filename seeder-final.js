require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const defaultProducts = require('./extracted_products');

console.log('--- STARTING FINAL SEEDER ---');
console.log('Connecting to Mongo Atlas...');

// Force DNS fix
mongoose.connect(process.env.MONGO_URI, {
    family: 4,
    tlsAllowInvalidCertificates: true,
    serverSelectionTimeoutMS: 5000
})
  .then(async () => {
      console.log('CONNECTED! Processing Database Seed...');
      
      // Clear old data
      await Product.deleteMany({});
      console.log('Cleaned old products.');

      // Insert all products from the list
      await Product.insertMany(defaultProducts);
      console.log('INSERTED ' + defaultProducts.length + ' PRODUCTS SUCCESSFULLY!');
      
      console.log('--- SEEDING COMPLETE ---');
      process.exit(0);
  })
  .catch((err) => {
      console.error('CRITICAL ERROR:', err.message);
      process.exit(1);
  });
