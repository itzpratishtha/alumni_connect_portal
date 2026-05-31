import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4
});

export async function sendOTPEmail(email, otp) {
  await transporter.sendMail({
    from: `"PIET Alumni Connect" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email - PIET Alumni Connect",
    html: `
      <div style="font-family:Arial,sans-serif">
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>

        <h1 style="letter-spacing:5px">
          ${otp}
        </h1>

        <p>
          This OTP will expire in 10 minutes.
        </p>
      </div>
    `
  });
}