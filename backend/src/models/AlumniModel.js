import db from "../config/db.js";

export const getAlumni = async (filters) => {
  let query = `
    SELECT users.id, users.name, users.email, users.role,
           profiles.batch, profiles.domain, profiles.company, profiles.location,
           profiles.linkedin, profiles.github
    FROM users
    JOIN profiles ON users.id = profiles.user_id
    WHERE users.role = 'alumni'
  `;

  const params = [];

  if (filters.batch) {
    query += " AND profiles.batch = ?";
    params.push(filters.batch);
  }

  if (filters.domain) {
    query += " AND profiles.domain LIKE ?";
    params.push(`%${filters.domain}%`);
  }

  if (filters.company) {
    query += " AND profiles.company LIKE ?";
    params.push(`%${filters.company}%`);
  }

  if (filters.location) {
    query += " AND profiles.location LIKE ?";
    params.push(`%${filters.location}%`);
  }

  query += " ORDER BY users.name ASC";

  const [rows] = await db.query(query, params);
  return rows;
};
