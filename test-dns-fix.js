const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');

const users = ['nipunibeauty', 'Madhura', 'admin', 'beautyadmin', 'nexora', 'beautyinbalance'];
const pass = 'admin1234';
const cluster = 'cluster0.cdk8tzx.mongodb.net';

async function test() {
    console.log('Testing with Google DNS 8.8.8.8...');
    for (const u of users) {
        const uri = `mongodb+srv://${u}:${pass}@${cluster}/BeautyInBalance?retryWrites=true&w=majority`;
        console.log(`Trying ${u}:${pass}...`);
        try {
            await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
            console.log(`\n🎉 CONNECTED SUCCESSFULLY! User: ${u}\nURI: ${uri}`);
            process.exit(0);
        } catch (err) {
            console.log(`  └─ Failed: ${err.message}`);
        }
    }
}

test();
