import jwt from "jsonwebtoken";
import { findUserById } from "../models/UserModel.js";

export const authRequired = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
       return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

   } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
  }
};

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // ✅ important
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
