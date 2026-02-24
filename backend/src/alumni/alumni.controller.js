
// alumni.controller.js

import { getAlumni } from "../models/AlumniModel.js";

export const listAlumni = async (req, res) => {
  try {
    const filters = {
      batch: req.query.batch || null,
      domain: req.query.domain || null,
      company: req.query.company || null,
      location: req.query.location || null
    };

    const alumni = await getAlumni(filters);
    res.status(200).json(alumni);

  } catch (error) {
    console.error("LIST ALUMNI ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};