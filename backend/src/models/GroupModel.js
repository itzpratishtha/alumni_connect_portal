import db from "../config/db.js";

export const createGroup = async (name, description, userId) => {
  const [result] = await db.query(
    "INSERT INTO `groups` (name, description, created_by) VALUES (?, ?, ?)",
    [name, description, userId]
  );
  return result.insertId;
};

export const joinGroupModel = async (groupId, userId) => {
  await db.query(
    "INSERT INTO group_members (group_id, user_id) VALUES (?, ?)",
    [groupId, userId]
  );
};

export const getAllGroups = async () => {
  const [rows] = await db.query("SELECT * FROM `groups` ORDER BY created_at DESC");
  return rows;
};

export const sendGroupMessageModel = async (groupId, senderId, message) => {
  const [result] = await db.query(
    "INSERT INTO group_messages (group_id, sender_id, message_text) VALUES (?, ?, ?)",
    [groupId, senderId, message]
  );
  return result.insertId;
};

export const getGroupMessagesModel = async (groupId) => {
  const [rows] = await db.query(
    "SELECT * FROM group_messages WHERE group_id=? ORDER BY created_at ASC",
    [groupId]
  );
  return rows;
};
