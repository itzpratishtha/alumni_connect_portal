import db from "../config/db.js";

export const createJob = async (userId, data) => {
  const [result] = await db.query(
    `INSERT INTO jobs (alumni_id, title, company, location, job_type, description, apply_link)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, data.title, data.company, data.location, data.job_type, data.description, data.apply_link]
  );
  return result.insertId;
};

export const getJobs = async () => {
  const [rows] = await db.query("SELECT * FROM jobs ORDER BY created_at DESC");
  return rows;
};
