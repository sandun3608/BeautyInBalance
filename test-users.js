const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');

const users = ['Madhara11', 'newbeauty', 'nipunibeauty'];
const passwords = [
    'admin1234',
    'BeautyAdmin2026',
    'BeautyAdmin%402026',
    'BeautyAdmin@2026',
    'monGO%401stBeauty',
    'monGO@1stBeauty',
    'fashion',
    'usernew',
    'admin'
];
const cluster = 'cluster0.cdk8tzx.mongodb.net';

async function test() {
    for (const u of users) {
        for (const p of passwords) {
            const uri = `mongodb+srv://${u}:${encodeURIComponent(p)}@${cluster}/BeautyInBalance?retryWrites=true&w=majority`;
            try {
                await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
                console.log(`\n🎉 SUCCESSFUL CONNECTION FOUND! 🎉`);
                console.log(`USER: ${u}`);
                console.log(`PASS: ${p}`);
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
