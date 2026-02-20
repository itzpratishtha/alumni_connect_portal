import db from "../config/db.js";
import { createProfile, updateProfile, getProfileByUserId } from "../models/ProfileModel.js";

export const getMyProfile = async (req, res) => {
  try {
    const profile = await getProfileByUserId(req.user.id);
    return res.status(200).json({ success: true, profile: profile || {} });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createOrUpdateProfile = async (req, res) => {
  try {
    const profile = await getProfileByUserId(req.user.id);

    if (!profile) {
      await createProfile(req.user.id, req.body);
    } else {
      await updateProfile(req.user.id, req.body);
    }

    // 🔥 ALWAYS return updated profile
    const updatedProfile = await getProfileByUserId(req.user.id);

    return res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("PROFILE UPDATE ERROR:", error);
    return res.status(500).json({ message: "Profile update failed" });
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
