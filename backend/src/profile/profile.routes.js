import express from "express";
import {
  getMyProfile,
  createOrUpdateProfile,
  uploadPhoto,
  deletePhoto
} from "./profile.controller.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { upload } from "../config/upload.js";

const router = express.Router();

// Get logged-in user's profile
router.get("/me", verifyToken, getMyProfile);

// Create or Update profile
router.post("/me", verifyToken, createOrUpdateProfile);

router.post("/upload-photo", verifyToken, upload.single("photo"), uploadPhoto);

// ✅ Delete Photo
router.delete("/delete-photo", verifyToken, deletePhoto);


export default router;
