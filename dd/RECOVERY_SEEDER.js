require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const defaultProducts = require('./extracted_products');

async function runRecovery() {
    console.log('--- EMERGENCY DATA RECOVERY START ---');
    console.log(`Payload: ${defaultProducts.length} items ready.`);

    // Try multiple URI formats
    const uris = [
        process.env.MONGO_URI,
        "mongodb+srv://Madhura:monGO%401stBeauty@cluster0.f0divln.mongodb.net/BeautyInBalance?retryWrites=true&w=majority",
        "mongodb://Madhura:monGO%401stBeauty@ac-ltr1jms-shard-00-00.f0divln.mongodb.net:27017,ac-ltr1jms-shard-00-01.f0divln.mongodb.net:27017,ac-ltr1jms-shard-00-02.f0divln.mongodb.net:27017/beautyDB?tls=true&replicaSet=atlas-135fxe-shard-0&authSource=admin&retryWrites=true&w=majority"
    ];

    for (const uri of uris) {
        if (!uri) continue;
        console.log(`\nAttempting connection to: ${uri.substring(0, 30)}...`);
        
        try {
            await mongoose.connect(uri, {
                family: 4,
                serverSelectionTimeoutMS: 8000
            });
            console.log('✅ CONNECTED SUCCESS!');

            console.log('🗑️  Clearing old (empty) collection...');
            await Product.deleteMany({});
            
            console.log('📤  Restoring data...');
            const restored = await Product.insertMany(defaultProducts.map(p => ({
                ...p,
                stock: p.stock || 50,
                discount: p.discount || 0
            })));
            
            console.log(`\n🎊 SUCCESS! Restored ${restored.length} products.`);
            console.log('Website should be back to normal now.');
            process.exit(0);
        } catch (err) {
            console.error(`❌ FAILED with this URI: ${err.message}`);
            await mongoose.disconnect();
        }
    }

    console.log('\n🚨 ALL CONNECTION ATTEMPTS FAILED.');
    console.log('Please check your internet connection or if the MongoDB Atlas cluster is active.');
    process.exit(1);
}

runRecovery();
