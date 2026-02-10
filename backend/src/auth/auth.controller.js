import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  createUser,
  findUserByEmail,
  markUserVerified,
  saveOTP,
  verifyUserOTP
} from "../models/UserModel.js";

import { sendOtpEmail } from "../utils/email.js";

// ==============================
// ✅ REGISTER (AUTO-VERIFIED)
// Endpoint: POST /api/auth/register
// ==============================
export const register = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;
    // ...same validation as now...[file:23]

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await createUser(name, email, hashedPassword, role);

    // 1. generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. expiry 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await saveOtpForUser(userId, otp, expiresAt);

    // 3. send email
    await sendOtpEmail(email, otp);

    return res.status(201).json({
      success: true,
      message: "Registered successfully. Check your email for OTP.",
      userId, // optional: for client
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
// ==============================
// ✅ LOGIN
// Endpoint: POST /api/auth/login
// ==============================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await findUserByEmail(email.toLowerCase());
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.is_verified) {
     return res.status(403).json({
      success: false,
     message: "Please verify your email with OTP before login.",
     });
    }

    if (!process.env.JWT_SECRET) {
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

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const user = await findUserByEmail(email.toLowerCase());
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.otp || !user.otp_expires) {
      return res.status(400).json({ success: false, message: "No OTP generated" });
    }

    if (new Date() > new Date(user.otp_expires)) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    await markUserVerified(user.id);

    return res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
