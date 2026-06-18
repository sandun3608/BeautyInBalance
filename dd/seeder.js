require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const defaultProductsFromJS = require('./extracted_products');

const defaultProducts = defaultProductsFromJS.map(p => ({
    ...p,
    stock: p.stock || 50 // Ensure stock exists for all items
}));

mongoose.connect(process.env.MONGO_URI, {
    family: 4, // Force IPv4 routing to fix DNS block
    tlsAllowInvalidCertificates: true, // Bypass Antivirus/Zscaler SSL inspection
    serverSelectionTimeoutMS: 5000 // Error out quickly if failed
})
  .then(async () => {
      console.log('MongoDB connected for seeding...');
      // Clear existing old ones
      await Product.deleteMany();
      // Insert our new array
      await Product.insertMany(defaultProducts);
      console.log('Products successfully pushed to your Real Database!');
      process.exit();
  })
  .catch((err) => {
      console.error(err);
      process.exit(1);
  });
