// message.routes.js

import express from "express";
import { sendMessage, getMessages, getConversationList } from "./message.controller.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authRequired, sendMessage);
router.get(
  "/conversations",
  authRequired,
  getConversationList
);

router.get(
  "/:userId",
  authRequired,
  getMessages
);

export default router;