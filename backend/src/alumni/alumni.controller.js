import express from "express";
import { listAlumni } from "./alumni.controller.js";
import { authRequired } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Only students can search alumni
router.get(
  "/",
  authRequired,
  authorize("student"),
  listAlumni
);

export const listAlumni = async (req, res) => {
  try {
    const filters = {
      batch: req.query.batch || null,
      domain: req.query.domain || null,
      company: req.query.company || null,
      location: req.query.location || null,
    };

    const alumni = await getAlumni(filters);

    res.status(200).json(alumni);

  } catch (error) {
    console.error("LIST ALUMNI ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default router;