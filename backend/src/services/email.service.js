const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

async function sendPasswordResetEmail(toEmail, resetCode) {
  await transporter.sendMail({
    from: `"Alkhidmat Volunteer App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Password Reset Code",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #2E5395;">Password Reset Request</h2>
        <p>You requested to reset your password. Use the code below:</p>
        <h1 style="letter-spacing: 4px; color: #2E5395;">${resetCode}</h1>
        <p>This code will expire in 15 minutes. If you didn't request this, you can ignore this email.</p>
      </div>
    `,
  });
}

module.exports = { sendPasswordResetEmail };