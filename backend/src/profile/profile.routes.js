// profile.routes.js

import express from "express";
import {
  getMyProfile,
  uploadPhoto,
  deletePhoto,
  updateMyProfile
} from "./profile.controller.js";

import { authRequired } from "../middleware/authMiddleware.js";
import { upload } from "../config/upload.js";

const router = express.Router();

// Get logged-in user's profile
router.get("/me", authRequired, getMyProfile);

// Create or Update profile
router.put("/me", authRequired, updateMyProfile);

// Upload profile photo
router.post(
  "/upload-photo",
  authRequired,
  upload.single("photo"),
  uploadPhoto
);

// Delete profile photo
router.delete("/delete-photo", authRequired, deletePhoto);

export default router;