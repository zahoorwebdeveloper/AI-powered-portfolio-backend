import NodeCache from "node-cache";
import Project from "../models/project.model.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// get projects
export const getProjects = async (req, res) => {
  try {
    const result = await Project.find();
    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// add projects
export const addProjects = async (req, res) => {
  const { title, description, tech, live, github } = req.body;
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "Image is required",
      });
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "portfolio",
    });

    const project = await Project.create({
      title,
      description,
      tech,
      live,
      github,
      image: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
    return res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (err) {
    console.log("add project error", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (req.file?.path) {
      fs.unlink(req.file.path, () => {});
    }
  }
};

// update projects
export const updateProjects = async (req, res) => {
  const { id } = req.params;
  const { title, description, tech, live, github } = req.body;
  try {
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    project.title = title ?? project.title;
    project.description = description ?? project.description;
    project.tech = tech ?? project.tech;
    project.live = live ?? project.live;
    project.github = github ?? project.github;

    if (req.file) {
      if (project.image?.publicId) {
        await cloudinary.uploader.destroy(project.image.publicId);
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "portfolio",
      });
      project.image = {
        url: result?.secure_url,
        publicId: result?.public_id,
      };
    }

    await project.save();
    return res.json({
      message: "Project updated successfully!",
      project,
    });
  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (req.file?.path) {
      fs.unlink(req.file.path, () => {});
    }
  }
};

// delete projects
export const deleteProjects = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }
    return res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
