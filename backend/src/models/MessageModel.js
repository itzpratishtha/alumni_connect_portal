import pool from "../config/db.js";

export const sendMessageModel = async (senderId, receiverId, message) => {
  const [result] = await db.query(
    `INSERT INTO messages (sender_id, receiver_id, message_text) VALUES (?, ?, ?)`,
    [senderId, receiverId, message]
  );
  return result.insertId;
};

export const getMessagesModel = async (user1, user2) => {
  const [rows] = await db.query(
    `SELECT * FROM messages 
     WHERE (sender_id = ? AND receiver_id = ?)
     OR (sender_id = ? AND receiver_id = ?)
     ORDER BY created_at ASC`,
    [user1, user2, user2, user1]
  );
  return rows;
};

export const userExists = async (userId) => {
  const [rows] = await pool.query(
    "SELECT id FROM users WHERE id = ? LIMIT 1",
    [userId]
  );
  return rows.length > 0;
};