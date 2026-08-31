const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require('mongoose');

const users = ['nipunibeauty', 'Madhura', 'admin', 'beautyadmin', 'nexora', 'beautyinbalance'];
const passwords = [
    'BeautyAdmin2026',
    'BeautyAdmin%402026',
    'BeautyAdmin@2026',
    'monGO%401stBeauty',
    'monGO@1stBeauty',
    'admin1234',
    'admin@1234',
    'admin',
    '123456'
];
const cluster = 'cluster0.cdk8tzx.mongodb.net';

async function test() {
    for (const u of users) {
        for (const p of passwords) {
            const uri = `mongodb+srv://${u}:${encodeURIComponent(p)}@${cluster}/BeautyInBalance?retryWrites=true&w=majority`;
            try {
                await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
                console.log(`\n🎉 SUCCESSFUL CONNECTION FOUND! 🎉`);
                console.log(`User: ${u}`);
                console.log(`Password: ${p}`);
                console.log(`URI: ${uri}\n`);
                process.exit(0);
            } catch (err) {
                console.log(`Tried ${u} / ${p} └─ ${err.message}`);
            }
        }
    }
    console.log('\n❌ All combinations failed.');
    process.exit(1);
}

test();
