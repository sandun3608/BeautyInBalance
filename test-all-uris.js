const mongoose = require('mongoose');

const clusters = [
    'cluster0.cdk8tzx.mongodb.net',
    'cluster0.f0divln.mongodb.net'
];

const users = ['nipunibeauty', 'Madhura', 'admin', 'beautyadmin'];
const passwords = ['admin1234', 'BeautyAdmin2026', 'BeautyAdmin%402026', 'monGO%401stBeauty'];

async function testAll() {
    for (const cluster of clusters) {
        for (const user of users) {
            for (const pass of passwords) {
                const uri = `mongodb+srv://${user}:${pass}@${cluster}/BeautyInBalance?retryWrites=true&w=majority`;
                console.log(`Testing: ${user}:***@${cluster}`);
                try {
                    await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000, family: 4 });
                    console.log(`\n🎉 SUCCESSFUL CONNECTION FOUND! 🎉`);
                    console.log(`URI: ${uri}\n`);
                    process.exit(0);
                } catch (err) {
                    console.log(`  └─ Failed: ${err.message}`);
                }
            }
        }
    }
    console.log('\n❌ All combinations failed.');
    process.exit(1);
}

testAll();
