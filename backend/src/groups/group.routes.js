import express from "express";
import {
  createNewGroup,
  joinGroup,
  listGroups,
  sendGroupMessage,
  getGroupMessages
} from "./group.controller.js";

import { authRequired } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// 🔐 Alumni/Admin only
router.post("/", authRequired, authorize("alumni", "admin"), createNewGroup);

// 🔐 Any logged-in user
router.post("/join", authRequired, joinGroup);
router.get("/", authRequired, listGroups);
router.post("/message", authRequired, sendGroupMessage);
router.get("/:groupId/messages", authRequired, getGroupMessages);
router.get(
  "/members/:groupId",
  authRequired,
  listGroupMembers
);

export default router;