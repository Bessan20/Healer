const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_HOST, // "gmail" لأنه هتستخدم Gmail
        port: process.env.EMAIL_PORT, // 587 لبروتوكول SMTP
        auth: {
            user: process.env.EMAIL, // الإيميل اللي هتبعت منه
            pass: process.env.EMAIL_PASSWORD, // App Password
        },
    });

    const emailOptions = {
        from: process.env.EMAIL,
        to: option.email,
        subject: option.subject,
        text: option.message,  // استخدم text أو html حسب الحاجة
    };

    try {
        // إرسال الإيميل بشكل غير متزامن باستخدام await
        await transporter.sendMail(emailOptions);
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("There was an error sending the email.");
    }
};

module.exports = sendEmail;
