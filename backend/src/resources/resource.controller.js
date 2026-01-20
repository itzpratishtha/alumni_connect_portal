import { addResourceModel, getAllResources, getResourcesByCategory } from "../models/ResourceModel.js";

export const addResource = async (req, res) => {
  try {
    const id = await addResourceModel(req.body, req.user.id);
    res.status(201).json({ message: "Resource added", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listResources = async (req, res) => {
  try {
    if (req.query.category) {
      const resources = await getResourcesByCategory(req.query.category);
      return res.json(resources);
    }
    const resources = await getAllResources();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
