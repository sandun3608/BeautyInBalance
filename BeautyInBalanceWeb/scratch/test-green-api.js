require('dotenv').config();
const axios = require('axios');

async function testGreenApi() {
    const phone = process.env.WHATSAPP_PHONE;
    const greenApiId = process.env.GREEN_API_ID_INSTANCE;
    const greenApiToken = process.env.GREEN_API_TOKEN_INSTANCE;

    console.log("Using Config:");
    console.log("Phone:", phone);
    console.log("Instance ID:", greenApiId);
    console.log("Token:", greenApiToken);

    if (!phone || !greenApiId || !greenApiToken) {
        console.error("Missing config!");
        return;
    }

    const url = `https://api.green-api.com/waInstance${greenApiId}/sendMessage/${greenApiToken}`;
    const wpMessage = `🚨 BiB Live test message from Green API!`;

    try {
        const response = await axios.post(url, {
            chatId: `${phone}@c.us`,
            message: wpMessage
        });
        console.log("Response:", response.data);
    } catch (error) {
        console.error("Error sending message:", error.response ? error.response.data : error.message);
    }
}

testGreenApi();
