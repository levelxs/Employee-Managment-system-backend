const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        // service: "gmail",
        host : "smtp.gmail.com",
        port :587,
        secure :false,
        auth: {
            // user: process.env.EMAIL_USER,
            // pass: process.env.EMAIL_PASS,
            user:"laxmandeshpande00@gmail.com",
            pass:"peto zrla vhxe nksh",
        },
    });

    await transporter.sendMail({
        from: `"Support" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
};

module.exports = sendEmail;
