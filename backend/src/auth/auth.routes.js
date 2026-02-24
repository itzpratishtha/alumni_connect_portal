import express from "express";
import { register, login, logout, me } from "./auth.controller.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.post("/logout", authRequired, logout);
router.get("/me", authRequired, me);

export default router;