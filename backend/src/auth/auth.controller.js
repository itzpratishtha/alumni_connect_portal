import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  createUser,
  findUserByEmail,
  markUserVerified,
} from "../models/UserModel.js";

// ==============================
// OPTIONAL: College email restriction
// ==============================
const allowedDomains = ["poornima.org", "piet.poornima.edu.in"];

function isAllowedCollegeEmail(email) {
  if (!email || !email.includes("@")) return false;
  const domain = email.split("@")[1].toLowerCase();
  return allowedDomains.includes(domain);
}

// =====================================================
// ✅ REGISTER (AUTO VERIFIED – NO OTP)
// Endpoint: POST /api/auth/register
// =====================================================
export const register = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    // Normalize
    name = name?.trim();
    email = email?.trim().toLowerCase();

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // OPTIONAL domain check
    if (!isAllowedCollegeEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please use your college email",
      });
    }

    // 🔴 Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please login.",
      });
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await createUser(name, email, hashedPassword, role);

    // ✅ Auto verify user
    await markUserVerified(userId);

    return res.status(201).json({
      success: true,
      message: "Registered successfully. You can login now.",
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
// ✅ LOGIN
// Endpoint: POST /api/auth/login
// =====================================================
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();

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

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
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
