import nodemailer from "nodemailer";

import { Resend } from "resend";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err) => {
  if (err) {
    console.log("MAILER VERIFY ERROR:", err.message);
  } else {
    console.log("MAILER READY ✅");
  }
});


const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOTPEmail(toEmail, otp) {
  const { data, error } = await resend.emails.send({
    from: "PIET Alumni Connect <onboarding@resend.dev>",
    to: toEmail,
    subject: "Your OTP for PIET Alumni Connect",
    html: `<h2>Your OTP is: <b>${otp}</b></h2><p>Valid for 10 minutes.</p>`
  });

  if (error) throw new Error(error.message);
  return data;
}
