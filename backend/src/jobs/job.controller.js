import { createJob, getJobs } from "../models/JobModel.js";

export const postJob = async (req, res) => {
  try {
    if (req.user.role !== "alumni" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only alumni can post jobs" });
    }

    const jobId = await createJob(req.user.id, req.body);
    res.status(201).json({ message: "Job posted successfully", jobId });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await getJobs();
    res.json(jobs);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
