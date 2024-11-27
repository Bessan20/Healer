const nodemailer = require('nodemailer');

const sendEmail = (option) => {

    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_HOST,
        port : process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL,
            password: process.env.EMAIL_PASSWORD
        }
    })

    const emailOptions = {
        from: process.env.EMAIL,
        to: option.email,
        subject: option.subject,
        message: option.message,
    }
    transporter.sendMail(emailOptions);
}

module.exports = sendEmail;