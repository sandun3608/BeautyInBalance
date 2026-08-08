require('dotenv').config();
const axios = require('axios');

const greenApiId = process.env.GREEN_API_ID_INSTANCE;
const greenApiToken = process.env.GREEN_API_TOKEN_INSTANCE;
const wpPhone = process.env.WHATSAPP_PHONE;

console.log("=== Testing Green API Configuration ===");
console.log("GREEN_API_ID_INSTANCE:", greenApiId);
console.log("GREEN_API_TOKEN_INSTANCE:", greenApiToken ? "********" + greenApiToken.slice(-6) : "Not Configured");
console.log("WHATSAPP_PHONE (Recipient):", wpPhone);

if (!greenApiId || !greenApiToken || !wpPhone) {
    console.error("❌ Error: Missing credentials in .env file.");
    process.exit(1);
}

// Format phone for WhatsApp
const cleanedPhone = wpPhone.replace(/[^0-9]/g, '');

const testUrl = `https://api.green-api.com/waInstance${greenApiId}/getStateInstance/${greenApiToken}`;

async function runTest() {
    try {
        console.log("\n1. Checking Instance State...");
        const stateRes = await axios.get(testUrl);
        console.log("Instance State Response:", stateRes.data);

        console.log("\n2. Trying to send a test message to admin...");
        const sendUrl = `https://api.green-api.com/waInstance${greenApiId}/sendMessage/${greenApiToken}`;
        const sendRes = await axios.post(sendUrl, {
            chatId: `${cleanedPhone}@c.us`,
            message: "🔔 Beauty in Balance: This is a diagnostic test message."
        });
        console.log("Send Message Response:", sendRes.data);
        console.log("✅ Success! Test message sent.");
    } catch (err) {
        console.error("❌ Diagnostic Failed!");
        if (err.response) {
            console.error("HTTP Status Code:", err.response.status);
            console.error("Response Data:", err.response.data);
        } else {
            console.error("Error Message:", err.message);
        }
    }
}

runTest();
