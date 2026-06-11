const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const sendEmail = async (options) => {
    // 1. Try SMTP App Password first (Highly stable, doesn't expire)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS.trim()
                }
            });

            const mailOptions = {
                from: `Beauty in Balance <${process.env.EMAIL_USER}>`,
                to: options.email,
                subject: options.subject,
                html: options.html || options.message
            };

            await transporter.sendMail(mailOptions);
            console.log("✅ Email sent successfully via Nodemailer SMTP (App Password)");
            return;
        } catch (smtpError) {
            console.error("❌ Nodemailer SMTP Error:", smtpError.message);
            // If SMTP fails, we will fall back to Gmail API OAuth2 if credentials exist
        }
    }

    // 2. Fallback: Gmail REST API with OAuth2
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN) {
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
            return;
        } catch (oauthError) {
            console.error("❌ Gmail API OAuth Error:", oauthError.message);
            throw oauthError;
        }
    }

    throw new Error("No valid email configuration found (missing SMTP App Password or Gmail OAuth credentials)");
};

module.exports = sendEmail;
