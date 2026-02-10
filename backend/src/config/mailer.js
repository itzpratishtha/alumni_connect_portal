import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

export async function sendOTPEmail(email, otp) {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("❌ Gmail env vars missing");
      return false;
    }

    await transporter.sendMail({
      from: `"PIET Alumni Connect" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Email Verification",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Email Verification</h2>
          <p>Your OTP is:</p>
          <h1>${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `,
    });

    console.log("✅ OTP SENT VIA GMAIL:", otp, "TO:", email);
    return true;
  } catch (err) {
    console.error("❌ GMAIL OTP ERROR:", err.message);
    return false;
  }
}
