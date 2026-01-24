import { createGroup, joinGroupModel, getAllGroups, getGroupMessagesModel, sendGroupMessageModel } from "../models/GroupModel.js";

export const createNewGroup = async (req, res) => {
  try {
    if (req.user.role !== "alumni" && req.user.role !== "admin")
      return res.status(403).json({ message: "Only alumni or admin can create groups" });

    const { name, description } = req.body;
    const groupId = await createGroup(name, description, req.user.id);

    res.status(201).json({ message: "Group created", groupId });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const joinGroup = async (req, res) => {
  try {
    await joinGroupModel(req.body.groupId, req.user.id);
    res.json({ message: "Joined group successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listGroups = async (req, res) => {
  try {
    const groups = await getAllGroups();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const messageId = await sendGroupMessageModel(req.body.groupId, req.user.id, req.body.message);
    res.status(201).json({ message: "Message sent", messageId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const messages = await getGroupMessagesModel(req.params.groupId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
