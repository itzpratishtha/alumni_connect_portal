// group.controller.js

import {
  createGroup,
  joinGroupModel,
  getAllGroups,
  sendGroupMessageModel,
  getGroupMessagesModel,
  isGroupMember
} from "../models/GroupModel.js";

// ==============================
// Create new group (Alumni/Admin)
// ==============================
export const createNewGroup = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Group name is required" });
    }

    const groupId = await createGroup(name, description, req.user.id);

    res.status(201).json({
      message: "Group created successfully",
      groupId
    });

  } catch (error) {
    console.error("CREATE GROUP ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// Join a group
// ==============================
export const joinGroup = async (req, res) => {
  try {
    const { groupId } = req.body;

    if (!groupId) {
      return res.status(400).json({ message: "Group ID is required" });
    }

    await joinGroupModel(groupId, req.user.id);

    res.json({ message: "Joined group successfully" });

  } catch (error) {
    console.error("JOIN GROUP ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// List all groups
// ==============================
export const listGroups = async (req, res) => {
  try {
    const groups = await getAllGroups();
    res.json(groups);

  } catch (error) {
    console.error("LIST GROUPS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// Send group message (Members only)
// ==============================
export const sendGroupMessage = async (req, res) => {
  try {
    const { groupId, message } = req.body;

    if (!groupId || !message) {
      return res.status(400).json({ message: "Group ID and message are required" });
    }

    // 🔐 Membership validation
    const isMember = await isGroupMember(groupId, req.user.id);
    if (!isMember) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    const messageId = await sendGroupMessageModel(
      groupId,
      req.user.id,
      message
    );

    res.status(201).json({
      message: "Message sent successfully",
      messageId
    });

  } catch (error) {
    console.error("SEND GROUP MESSAGE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// Get group messages (Members only)
// ==============================
export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!groupId) {
      return res.status(400).json({ message: "Group ID is required" });
    }

    // 🔐 Membership validation
    const isMember = await isGroupMember(groupId, req.user.id);
    if (!isMember) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    const messages = await getGroupMessagesModel(groupId);
    res.json(messages);

  } catch (error) {
    console.error("GET GROUP MESSAGES ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};