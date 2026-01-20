import db from "../config/db.js";

export const createProfile = async (userId, data) => {
  const [result] = await db.query(
    `INSERT INTO profiles (user_id, phone, bio, profile_image, linkedin, github, batch, domain, company, location)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, data.phone, data.bio, data.profile_image, data.linkedin, data.github, data.batch, data.domain, data.company, data.location]
  );
  return result.insertId;
};

export const updateProfile = async (userId, data) => {
  await db.query(
    `UPDATE profiles SET phone=?, bio=?, profile_image=?, linkedin=?, github=?, batch=?, domain=?, company=?, location=? WHERE user_id=?`,
    [data.phone, data.bio, data.profile_image, data.linkedin, data.github, data.batch, data.domain, data.company, data.location, userId]
  );
};

export const getProfileByUserId = async (userId) => {
  const [rows] = await db.query("SELECT * FROM profiles WHERE user_id=?", [userId]);
  return rows[0];
};
