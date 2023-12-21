const nodemailer = require('nodemailer');

module.exports = async (email, subject, text) => {
    try {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'alosh.nexevo@gmail.com',
                pass: 'pscnpqdrrpcvxjbi'
            }
        });
        await transporter.sendMail({
            from: process.env.MY_USER_OF_Mail,
            to: email,
            subject: subject,
            text: text
        });
        console.log("Email Sent sucessfully")
    } catch (error) {
        console.log("Email not sent")
        console.log(error)
    }
}