require('dotenv').config();
const mongoose = require('mongoose');

const testConn = async () => {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('SUCCESS: Connection working! ✅');
        process.exit(0);
    } catch (error) {
        console.error('FAILED: Connection failed! ❌');
        console.error(error.message);
        process.exit(1);
    }
};

testConn();
