const { google } = require('googleapis');

const sendEmail = async (options) => {
    try {
        const OAuth2 = google.auth.OAuth2;
        const oauth2Client = new OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });

        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        // Create the email in base64 format (required by Gmail API)
        const subject = options.subject;
        const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
        const messageParts = [
            `From: Beauty in Balance <${process.env.EMAIL_USER}>`,
            `To: ${options.email}`,
            `Content-Type: text/html; charset=utf-8`,
            `MIME-Version: 1.0`,
            `Subject: ${utf8Subject}`,
            '',
            options.html || options.message,
        ];
        const message = messageParts.join('\n');

        // The body needs to be base64url encoded
        const encodedMessage = Buffer.from(message)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });

        console.log("✅ Email sent successfully via Gmail REST API (HTTPS)");
    } catch (error) {
        console.error("❌ Gmail API Error:", error);
        throw error;
    }
};

module.exports = sendEmail;
