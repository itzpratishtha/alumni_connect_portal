import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOTPEmail(email, otp) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log("❌ RESEND_API_KEY missing in environment variables");
      return false;
    }

    await resend.emails.send({
      from: "Alumni Connect <onboarding@resend.dev>",
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Your OTP is: ${otp}</h2>
          <p>This OTP is valid for <b>10 minutes</b>.</p>
          <p>If you did not request this, ignore this email.</p>
        </div>
      `,
    });

    console.log("✅ OTP email sent to:", email);
    return true;
  } catch (error) {
    console.log("❌ RESEND OTP EMAIL ERROR:", error?.message || error);
    return false;
  }
}
