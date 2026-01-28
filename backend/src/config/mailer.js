import { Resend } from "resend";

export async function sendOTPEmail(email, otp) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log("❌ RESEND_API_KEY is missing. OTP not sent.");
      return false;
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Alumni Connect <onboarding@resend.dev>",
      to: email,
      subject: "Your OTP Code",
      html: `
        <h2>Your OTP: ${otp}</h2>
        <p>Valid for 10 minutes.</p>
      `,
    });

    console.log("✅ OTP email sent to:", email);
    return true;
  } catch (err) {
    console.error("❌ RESEND ERROR:", err.message);
    return false;
  }
}