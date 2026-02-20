import express from "express";
import {
  getMyProfile,
  createOrUpdateProfile,
  uploadPhoto,
  deletePhoto,
  updateMyProfile
} from "./profile.controller.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { upload } from "../config/upload.js";
import { updateProfile } from "../models/ProfileModel.js";

const router = express.Router();

// Get logged-in user's profile
router.get("/me", verifyToken, getMyProfile);

// Create or Update profile
router.post("/me", verifyToken, updateMyProfile);

router.post("/upload-photo", verifyToken, upload.single("photo"), uploadPhoto);

// ✅ Delete Photo
router.delete("/delete-photo", verifyToken, deletePhoto);


export default router;
