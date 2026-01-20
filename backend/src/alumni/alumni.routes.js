import express from "express";
import { listAlumni } from "./alumni.controller.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

// Anyone logged in can view alumni list
router.get("/", authRequired, listAlumni);

export default router;
