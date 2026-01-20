import db from "../config/db.js";

export const addResourceModel = async (data, userId) => {
  const [result] = await db.query(
    `INSERT INTO resources (title, description, category, file_url, created_by)
     VALUES (?, ?, ?, ?, ?)`,
    [data.title, data.description, data.category, data.file_url, userId]
  );
  return result.insertId;
};

export const getAllResources = async () => {
  const [rows] = await db.query(`SELECT * FROM resources ORDER BY created_at DESC`);
  return rows;
};

export const getResourcesByCategory = async (category) => {
  const [rows] = await db.query(`SELECT * FROM resources WHERE category=?`, [category]);
  return rows;
};
