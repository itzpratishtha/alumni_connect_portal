import express from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import { createNewGroup, joinGroup, listGroups, sendGroupMessage, getGroupMessages } from "./group.controller.js";

const router = express.Router();

router.post("/", authRequired, createNewGroup);
router.post("/join", authRequired, joinGroup);
router.get("/", authRequired, listGroups);
router.post("/message", authRequired, sendGroupMessage);
router.get("/messages/:groupId", authRequired, getGroupMessages);

export default router;
