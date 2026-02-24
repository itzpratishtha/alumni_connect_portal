// message.controller.js

import {
  sendMessageModel,
  getMessagesModel,
  userExists
} from "../models/MessageModel.js";

// ==============================
// Send private message
// ==============================
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !message) {
      return res.status(400).json({
        message: "receiverId and message are required"
      });
    }

    // 🔐 Ensure receiver exists
    const exists = await userExists(receiverId);
    if (!exists) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const messageId = await sendMessageModel(senderId, receiverId, message);

    res.status(201).json({
      message: "Message sent successfully",
      messageId
    });

  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// Get conversation messages
// ==============================
export const getMessages = async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.userId;

    if (!receiverId) {
      return res.status(400).json({ message: "User ID required" });
    }

    // 🔐 Ensure receiver exists
    const exists = await userExists(receiverId);
    if (!exists) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 Only allow fetching own conversations
    const messages = await getMessagesModel(senderId, receiverId);

    res.json(messages);

  } catch (error) {
    console.error("GET MESSAGES ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};