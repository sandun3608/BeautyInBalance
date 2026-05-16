const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Switching to SendGrid for better reliability on Render
    // We will use the API Key provided by SendGrid
    const transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
            user: 'apikey', // This is ALWAYS 'apikey' for SendGrid
            pass: process.env.SENDGRID_API_KEY, // Your SendGrid API Key
        }
    });

    const mailOptions = {
        from: `Beauty in Balance <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
