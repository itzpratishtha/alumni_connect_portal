import { getAlumni } from "../models/AlumniModel.js";

export const listAlumni = async (req, res) => {
  try {
    const filters = {
      batch: req.query.batch,
      domain: req.query.domain,
      company: req.query.company,
      location: req.query.location
    };

    const alumni = await getAlumni(filters);
    res.json(alumni);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
