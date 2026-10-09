import nodemailer from "nodemailer";

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST || "smtp.gmail.com",
    port: process.env.SMPT_PORT || 465,
    service: process.env.SMPT_SERVICE || "gmail",
    auth: {
      user: process.env.SMPT_MAIL, // Aapka Gmail ID
      pass: process.env.SMPT_PASSWORD, // Gmail App Password
    },
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendMail;