// resources.routes.js

import express from "express";
import { addResource, listResources } from "./resources.controller.js";
import { authRequired } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Alumni/Admin can add resources
router.post(
  "/",
  authRequired,
  authorize("alumni", "admin"),
  addResource
);

// Any logged-in user can view resources
router.get("/", authRequired, listResources);

export default router;