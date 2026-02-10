import express from "express";
import { register , login } from "./auth.controller.js";
import { authRequired } from "../middleware/authMiddleware.js";


const router = express.Router();

// Register user route
router.post("/register", register);

// Login user route (you already have login controller)
router.post("/login", login);
// Test route
router.get("/check", (req, res) => {
  res.send("Auth route working");
});

router.get("/verify", authRequired, (req, res) => {
    res.json({ success: true });
});

export default router;


console.log("AUTH ROUTES LOADED!!!");
