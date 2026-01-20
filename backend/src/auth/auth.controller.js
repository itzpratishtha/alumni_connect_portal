import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import {
  createUser,
  findUserByEmail,
  saveOTP,
  verifyUserOTP,
  markUserVerified,
} from "../models/UserModel.js";

// ==============================
// ✅ Email domain restriction
// ==============================
const allowedDomains = ["poornima.org", "piet.poornima.edu.in"];

function isAllowedCollegeEmail(email) {
  if (!email || !email.includes("@")) return false;
  const domain = email.split("@")[1].toLowerCase();
  return allowedDomains.includes(domain);
}

// ==============================
// ✅ OTP Generator
// ==============================
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
}

// ==============================
// ✅ Nodemailer Transport
// ==============================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ==============================
// ✅ Send OTP Mail
// ==============================
async function sendOtpEmail(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "PIET Alumni Connect - OTP Verification",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>PIET Alumni Connect Portal</h2>
        <p>Your OTP for email verification is:</p>
        <h1 style="letter-spacing: 3px;">${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
        <p>If you didn't request this, ignore this email.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

// =====================================================
// ✅ REGISTER (OTP sent, user not verified initially)
// Endpoint: POST /api/auth/register
// =====================================================
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!isAllowedCollegeEmail(email)) {
      return res.status(400).json({
        success: false,
        message:
          "Please use your official college email only (@poornima.org or @piet.poornima.edu.in)",
      });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please login.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await createUser(name, email, hashedPassword, role);

    // Generate OTP + expiry (10 mins)
    const otp = generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await saveOTP(userId, otp, expires);

    // Send OTP email
    await sendOtpEmail(email, otp);

    return res.status(201).json({
      success: true,
      message: "Registration successful. OTP sent to your email.",
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================================
// ✅ VERIFY OTP (Only for registration)
// Endpoint: POST /api/auth/verify-otp
// =====================================================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ If already verified, don't throw error
    if (user.is_verified === 1) {
      return res.status(200).json({
        success: true,
        message: "User already verified",
      });
    }

    // Check OTP + expiry
    if (!user.otp || !user.otp_expires) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please resend OTP.",
      });
    }

    const now = new Date();
    const expiry = new Date(user.otp_expires);

    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (now > expiry) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please resend OTP.",
      });
    }

    await markUserVerified(user.id);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully. You can login now.",
    });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================================
// ✅ RESEND OTP (Only if not verified)
// Endpoint: POST /api/auth/resend-otp
// =====================================================
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.is_verified === 1) {
      return res.status(400).json({
        success: false,
        message: "User already verified. Please login.",
      });
    }

    const otp = generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await saveOTP(user.id, otp, expires);

    await sendOtpEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully. Check your email.",
    });
  } catch (err) {
    console.error("RESEND OTP ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================================
// ✅ LOGIN (Only email + password)
// Endpoint: POST /api/auth/login
// =====================================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.is_verified === 0) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.log("JWT_SECRET missing in .env");
      return res.status(500).json({
        success: false,
        message: "JWT secret not configured",
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
