import express from "express";
import { sendMessage, getMessages } from "./message.controller.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", authRequired, sendMessage);
router.get("/:userId", authRequired, getMessages);

export default router;
