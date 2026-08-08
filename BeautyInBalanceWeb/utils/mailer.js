const axios = require('axios');

const sendEmail = async (options) => {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
        console.error("❌ Resend API Key is missing! Please configure RESEND_API_KEY.");
        throw new Error("Resend API Key is not configured in Environment Variables");
    }

    try {
        // If they verified their domain, process.env.EMAIL_USER (support@beautyinbalance.lk) will be used as sender.
        // Otherwise, onboarding@resend.dev can be used for initial testing.
        const fromEmail = process.env.EMAIL_USER || 'onboarding@resend.dev';

        const response = await axios.post('https://api.resend.com/emails', {
            from: `Beauty in Balance <${fromEmail}>`,
            to: [options.email],
            subject: options.subject,
            html: options.html || options.message
        }, {
            headers: {
                'Authorization': `Bearer ${resendApiKey.trim()}`,
                'Content-Type': 'application/json'
            }
        });

        console.log("✅ Email sent successfully via Resend API (HTTPS):", response.data.id);
    } catch (error) {
        const errorData = error.response ? JSON.stringify(error.response.data) : error.message;
        console.error("❌ Resend API Error:", errorData);
        throw new Error(`Resend sending failed: ${errorData}`);
    }
};

module.exports = sendEmail;
