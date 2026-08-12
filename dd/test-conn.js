const mongoose = require('mongoose');
const uri = 'mongodb+srv://nipunibeauty:BeautyAdmin%402026@cluster0.cdk8tzx.mongodb.net/BeautyInBalance?retryWrites=true&w=majority';

async function test() {
    try {
        console.log('Testing connection with %40...');
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('CONNECTED SUCCESS WITH %40! ✅');
        process.exit(0);
    } catch (err) {
        console.error('FAILED WITH %40 ❌:', err.message);
        
        const uri2 = 'mongodb+srv://nipunibeauty:BeautyAdmin2026@cluster0.cdk8tzx.mongodb.net/BeautyInBalance?retryWrites=true&w=majority';
        console.log('Testing connection WITHOUT %40...');
        try {
            await mongoose.connect(uri2, { serverSelectionTimeoutMS: 5000 });
            console.log('CONNECTED SUCCESS WITHOUT %40! ✅');
            process.exit(0);
        } catch (err2) {
            console.error('FAILED WITHOUT %40 ❌:', err2.message);
            process.exit(1);
        }
    }
}
test();
