// job.routes.js

import express from "express";
import { postJob, getAllJobs } from "./job.controller.js";
import { authRequired } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Alumni/Admin only
router.post("/", authRequired, authorize("alumni", "admin"), postJob);

// Any logged-in user
router.get("/", authRequired, getAllJobs);

export default router;