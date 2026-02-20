import pool from "../config/db.js";

// CREATE USER
export async function createUser(name, email, password, role) {
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, password, role]
  );
  return result.insertId;
}

// FIND USER BY EMAIL
export async function findUserByEmail(email) {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  return rows[0];
}

// FIND USER BY ID
export async function findUserById(id) {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0];
}

export const saveOTP = async (userId, otp, expires) => {
  await pool.query(
    "UPDATE users SET otp=?, otp_expires=? WHERE id=?",
    [otp, expires, userId]
  );
};

export const verifyUserOTP = async (email, otp) => {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email=? AND otp=?",
    [email, otp]
  );
  return rows[0];
};

export const markUserVerified = async (userId) => {
  await pool.query(
    "UPDATE users SET is_verified=1, otp=NULL, otp_expires=NULL WHERE id=?",
    [userId]
  );
};
