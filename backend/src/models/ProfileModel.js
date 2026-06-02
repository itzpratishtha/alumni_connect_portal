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

export const profileExists = async (userId) => {
  const [rows] = await db.query(
    "SELECT user_id FROM profiles WHERE user_id=?",
    [userId]
  );

  return rows.length > 0;
};


export const getProfileByUserId = async (userId) => {
  const [rows] = await db.query(
    `
    SELECT
      u.id,
      u.name,
      u.email,
      u.role,
      u.photo,

      p.phone,
      p.bio,
      p.profile_image,
      p.linkedin,
      p.github,
      p.batch,
      p.domain,
      p.company,
      p.location

    FROM users u
    LEFT JOIN profiles p
      ON u.id = p.user_id

    WHERE u.id = ?
    `,
    [userId]
  );

  return rows[0];
};