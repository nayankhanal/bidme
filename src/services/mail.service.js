import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

export const sendEmail = ({ to, subject, text, html }) => {
    try {
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: to,
            subject: subject,
            text: text,
            html: html
        }

        transporter.sendMail(mailOptions)
            .then(info => console.log("Email sent", info))
            .catch(err => console.error("Email error", err));

    } catch (error) {
        console.error(error);
    }
}