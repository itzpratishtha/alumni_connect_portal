import express from "express";
import { postJob, getAllJobs } from "./job.controller.js";
import { authRequired } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create job posting (alumni only)
router.post("/", authRequired, postJob);

// View all jobs
router.get("/", authRequired, getAllJobs);

export default router;
