import express from "express";
import { authRequired } from "../middleware/authMiddleware.js";
import { addResource, listResources } from "./resource.controller.js";

const router = express.Router();

router.post("/", authRequired, addResource);  // Add resource
router.get("/", authRequired, listResources); // List all / filter

export default router;
