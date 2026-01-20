import { sendMessageModel, getMessagesModel } from "../models/MessageModel.js";

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    if (!receiverId || !message)
      return res.status(400).json({ message: "receiverId and message required" });

    const messageId = await sendMessageModel(req.user.id, receiverId, message);

    res.status(201).json({ message: "Message sent", messageId });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const receiverId = req.params.userId;
    const senderId = req.user.id;

    const messages = await getMessagesModel(senderId, receiverId);
    res.json(messages);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
