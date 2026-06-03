import axios from "axios";

export async function sendOTPEmail(email, otp) {

  await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: {
        name: "PIET Alumni Connect",
        email: "pratishthasomani19@gmail.com"
      },

      to: [
        { email }
      ],

      subject: "Verify Your Email",

      htmlContent: `
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Expires in 10 minutes.</p>
      `
    },
    {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json"
      }
    }
  );

}