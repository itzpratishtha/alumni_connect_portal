// resources.controller.js

import {
  addResourceModel,
  getAllResources,
  getResourcesByCategory
} from "../models/ResourceModel.js";

// ==============================
// Add a new resource
// ==============================
export const addResource = async (req, res) => {
  try {
    const resourceData = req.body;

    if (!resourceData || Object.keys(resourceData).length === 0) {
      return res.status(400).json({ message: "Resource data is required" });
    }

    const id = await addResourceModel(resourceData, req.user.id);

    res.status(201).json({
      message: "Resource added successfully",
      id
    });

  } catch (error) {
    console.error("ADD RESOURCE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// List resources (with optional category filter)
// ==============================
export const listResources = async (req, res) => {
  try {
    const { category } = req.query;

    const resources = category
      ? await getResourcesByCategory(category)
      : await getAllResources();

    res.json(resources);

  } catch (error) {
    console.error("LIST RESOURCES ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};