import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendOTPEmail(email, otp) {
  try {
    const msg = {
      to: email,
      from: "piet.alumni.connect@gmail.com", // must be verified ONCE in SendGrid
      subject: "Your OTP for Email Verification",
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Valid for 10 minutes.</p>
      `,
    };

    await sgMail.send(msg);
    console.log("✅ OTP SENT VIA SENDGRID:", otp, "TO:", email);
    return true;
  } catch (err) {
    console.error("❌ SENDGRID ERROR:", err.response?.body || err.message);
    return false;
  }
}
