// job.controller.js

import { createJob, getJobs } from "../models/JobModel.js";

// ==============================
// Post a job (Alumni/Admin only)
// ==============================
export const postJob = async (req, res) => {
  try {
    const jobData = req.body;

    if (!jobData || Object.keys(jobData).length === 0) {
      return res.status(400).json({ message: "Job details are required" });
    }

    const jobId = await createJob(req.user.id, jobData);

    res.status(201).json({
      message: "Job posted successfully",
      jobId
    });

  } catch (error) {
    console.error("POST JOB ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// Get all jobs (Any logged-in user)
// ==============================
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await getJobs();
    res.json(jobs);

  } catch (error) {
    console.error("GET JOBS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};