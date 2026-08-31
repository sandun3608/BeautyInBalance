const dns = require('dns');
dns.setServers(['8.8.8.8']);
const mongoose = require('mongoose');

const uri = "mongodb+srv://newbeauty:admin1234@cluster0.cdk8tzx.mongodb.net/BeautyInBalance?retryWrites=true&w=majority";

async function inspect() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to Atlas successfully!');
        const admin = mongoose.connection.db.admin();
        
        // List databases
        const dbs = await admin.listDatabases();
        console.log('--- DATABASES ---');
        for (const dbInfo of dbs.databases) {
            console.log(`Database: ${dbInfo.name}`);
            const db = mongoose.connection.client.db(dbInfo.name);
            const collections = await db.listCollections().toArray();
            for (const col of collections) {
                const count = await db.collection(col.name).countDocuments();
                console.log(`  └─ Collection: ${col.name} (${count} documents)`);
            }
        }
        process.exit(0);
    } catch (err) {
        console.error('Inspect Error:', err);
        process.exit(1);
    }
}

inspect();
