import pool from "../config/db.js";

export const createGroup = async (name, description, userId) => {
  const [result] = await pool.query(
    "INSERT INTO `groups` (name, description, created_by) VALUES (?, ?, ?)",
    [name, description, userId]
  );

  return result.insertId;
};

export const joinGroupModel = async (groupId, userId) => {
  await pool.query(
    "INSERT IGNORE INTO group_members (group_id, user_id) VALUES (?, ?)",
    [groupId, userId]
  );
};

export const getAllGroups = async () => {
  const [rows] = await pool.query(
    "SELECT * FROM `groups` ORDER BY created_at DESC"
  );

  return rows;
};

export const sendGroupMessageModel = async (groupId, senderId, message) => {
  const [result] = await pool.query(
    "INSERT INTO group_messages (group_id, sender_id, message_text) VALUES (?, ?, ?)",
    [groupId, senderId, message]
  );

  return result.insertId;
};

export const getGroupMessagesModel = async (groupId) => {
  const [rows] = await pool.query(
    `SELECT gm.*, u.name AS sender_name
     FROM group_messages gm
     JOIN users u ON gm.sender_id = u.id
     WHERE gm.group_id=?
     ORDER BY gm.created_at ASC`,
    [groupId]
  );

  return rows;
};

export const isGroupMember = async (groupId, userId) => {
  const [rows] = await pool.query(
    "SELECT 1 FROM group_members WHERE group_id=? AND user_id=? LIMIT 1",
    [groupId, userId]
  );

  return rows.length > 0;
};

export const getGroupMembers = async (groupId) => {

  const [rows] = await pool.query(
    `
    SELECT
      u.id,
      u.name,
      u.role,
      p.domain,
      p.company
    FROM group_members gm
    JOIN users u
      ON gm.user_id = u.id
    LEFT JOIN profiles p
      ON p.user_id = u.id
    WHERE gm.group_id=?
    `,
    [groupId]
  );

  return rows;
};