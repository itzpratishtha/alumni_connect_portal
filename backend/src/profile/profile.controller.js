import pool from "../config/db.js";
import { createProfile, updateProfile, getProfileByUserId } from "../models/ProfileModel.js";

export const getMyProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, email, role, batch, domain, company, location, linkedin, github, photo
       FROM users WHERE id = ?`,
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/profile/me
export const updateMyProfile = async (req, res) => {
  try {
    const {
      name,
      batch,
      domain,
      company,
      location,
      linkedin,
      github,
    } = req.body;

    await pool.query(
      `UPDATE users SET
        name = ?, batch = ?, domain = ?, company = ?, location = ?, linkedin = ?, github = ?
       WHERE id = ?`,
      [name, batch, domain, company, location, linkedin, github, req.user.id]
    );

    // 🔥 RETURN UPDATED USER (CRITICAL)
    const [rows] = await pool.query(
      `SELECT id, name, email, role, batch, domain, company, location, linkedin, github, photo
       FROM users WHERE id = ?`,
      [req.user.id]
    );

    res.json(rows[0]);
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
