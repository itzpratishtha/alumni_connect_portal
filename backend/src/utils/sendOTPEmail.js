import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4,
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000
});

export async function sendOTPEmail(email, otp) {

  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

  await transporter.verify();
  console.log("SMTP READY");

  await transporter.sendMail({
    from: `"PIET Alumni Connect" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email - PIET Alumni Connect",
    html: `
      <h2>Email Verification</h2>
      <h1>${otp}</h1>
    `
  });

  console.log("EMAIL SENT");
}