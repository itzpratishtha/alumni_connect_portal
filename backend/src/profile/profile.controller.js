import pool from "../config/db.js";
import { createProfile, updateProfile, getProfileByUserId } from "../models/ProfileModel.js";

export const getMyProfile = async (req, res) => {
  try {
    const profile = await getProfileByUserId(req.user.id);

    if (!profile) {
      return res.status(200).json({
        user_id: req.user.id,
        phone: "",
        bio: "",
        profile_image: "",
        linkedin: "",
        github: "",
        batch: "",
        domain: "",
        company: "",
        location: "",
      });
    }

    res.json(profile);
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to load profile" });
  }
};

// PUT /api/profile/me
export const updateMyProfile = async (req, res) => {
  try {
    const existingProfile = await getProfileByUserId(req.user.id);

    if (!existingProfile) {
      await createProfile(req.user.id, req.body);
    } else {
      await updateProfile(req.user.id, req.body);
    }

    // 🔥 RETURN UPDATED PROFILE (CRITICAL)
    const updatedProfile = await getProfileByUserId(req.user.id);
    res.status(200).json(updatedProfile);

  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Profile update failed" });
  }
};

export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No photo uploaded" });
    }

    const photoPath = `/uploads/${req.file.filename}`;

    await db.query("UPDATE users SET photo = ? WHERE id = ?", [photoPath, req.user.id]);

    return res.status(200).json({
      success: true,
      message: "Photo uploaded successfully",
      photo: photoPath,
    });
  } catch (error) {
    console.error("UPLOAD PHOTO ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deletePhoto = async (req, res) => {
  try {
    await db.query("UPDATE users SET photo = NULL WHERE id = ?", [req.user.id]);

    return res.status(200).json({
      success: true,
      message: "Photo deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PHOTO ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
