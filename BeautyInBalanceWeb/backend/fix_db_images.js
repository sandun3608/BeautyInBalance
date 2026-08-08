const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://Madhura:monGO%401stBeauty@ac-ltr1jms-shard-00-00.f0divln.mongodb.net:27017,ac-ltr1jms-shard-00-01.f0divln.mongodb.net:27017,ac-ltr1jms-shard-00-02.f0divln.mongodb.net:27017/beautydb?ssl=true&replicaSet=atlas-13rrzv-shard-0&authSource=admin&appName=Cluster0';

const productSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  cat: String,
  filter: String,
  stock: Number,
  img: String,         
  images: [String],
  desc: String,
  benefits: [String],
  howToUse: String,
  authenticity: String,
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

const Product = mongoose.model('Product', productSchema);

function formatImageString(str) {
    if (!str) return str;
    // Specifically target occurrences of '%25' or '%2B' and revert them first if they exist
    // to avoid double encoding if we run this script multiple times.
    let s = str.replace(/%25/g, '%').replace(/%2B/g, '+');
    // Encode percent and plus
    s = s.replace(/%/g, '%25').replace(/\+/g, '%2B');
    return s;
}

async function fix() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to DB!");

  const products = await Product.find({});
  let count = 0;
  for (let p of products) {
    let changed = false;
    
    if (p.img) {
      let newImg = formatImageString(p.img);
      if (newImg !== p.img) {
        p.img = newImg;
        changed = true;
      }
    }

    if (p.images && p.images.length > 0) {
      let newImages = [];
      let imagesChanged = false;
      for (let img of p.images) {
        let newImg = formatImageString(img);
        newImages.push(newImg);
        if (newImg !== img) {
            imagesChanged = true;
        }
      }
      if (imagesChanged) {
        p.images = newImages;
        changed = true;
      }
    }

    if (changed) {
      await p.save();
      console.log(`Updated DB for: ${p.name} -> new img: ${p.img}`);
      count++;
    }
  }

  console.log(`Fixed ${count} products in Database.`);
  mongoose.connection.close();
}

fix();
