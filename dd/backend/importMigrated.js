const mongoose = require('mongoose');
const fs = require('fs');

const URI = 'mongodb://newbeauty:admin1234@ac-awuecsj-shard-00-00.cdk8tzx.mongodb.net:27017,ac-awuecsj-shard-00-01.cdk8tzx.mongodb.net:27017,ac-awuecsj-shard-00-02.cdk8tzx.mongodb.net:27017/beautydb?tls=true&replicaSet=atlas-ffl4zd-shard-0&authSource=admin&retryWrites=true&w=majority';
const INPUT_FILE = 'C:\\Users\\etsy dream\\Desktop\\products_db_migrated.json';

const productSchema = new mongoose.Schema({
    id: String,
    name: String,
    price: Number,
    cat: String,
    filter: String,
    img: String,       
    images: [String],  
    desc: String,
    benefits: [String],
    howToUse: String,
    authenticity: String
}, { strict: false });

const Product = mongoose.model('Product', productSchema);

async function importData() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(URI, { 
            family: 4,
            serverSelectionTimeoutMS: 15000,
            connectTimeoutMS: 15000
        });
        console.log("✅ Connected successfully!");

        console.log("Reading file...");
        const raw = fs.readFileSync(INPUT_FILE, 'utf8');
        const data = JSON.parse(raw);
        const products = data.value || data;

        console.log(`Found ${products.length} products to import.`);

        console.log("Clearing existing products...");
        await Product.deleteMany({});
        
        console.log("Inserting migrated products...");
        const formattedProducts = products.map(p => {
            if (p._id && p._id.$oid) p._id = p._id.$oid;
            return p;
        });
        
        await Product.insertMany(formattedProducts);
        
        console.log("🎉 Import completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Error during import:", err);
        process.exit(1);
    }
}

importData();
