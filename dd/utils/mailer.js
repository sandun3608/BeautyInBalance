const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1) Create a transporter
    // For production, you should use environment variables
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Or use host: 'smtp.gmail.com', port: 465, etc.
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS, // Your App Password
        },
    });

    // 2) Define the email options
    const mailOptions = {
        from: `Beauty in Balance <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
