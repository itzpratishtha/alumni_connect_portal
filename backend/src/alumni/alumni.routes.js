import express from "express";
import { listAlumni } from "./alumni.controller.js";
import { authRequired } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Only students can view alumni list
router.get(
  "/",
  authRequired,
  authorize("student"),
  listAlumni
);

export default router;