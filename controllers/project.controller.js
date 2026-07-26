import NodeCache from "node-cache";
import Project from "../models/project.model.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

// get projects
export const getProjects = async (req, res) => {
  try {
    const result = await Project.find();
    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const addProjects = async (req, res) => {
  try {
    const { title, description, tech, live, github } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required.",
      });
    }

    // Validate image
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Project image is required.",
      });
    }

    // Upload image to Cloudinary
    const uploadedImage = await uploadToCloudinary(req.file.buffer);

    let technologies = tech;

    if (typeof tech === "string") {
      try {
        technologies = JSON.parse(tech);
      } catch {
        technologies = tech
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }

    const project = await Project.create({
      title: title.trim(),
      description: description.trim(),
      tech: technologies,
      live: live?.trim() || "",
      github: github?.trim() || "",
      image: {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully.",
      project,
    });
  } catch (error) {
    console.error("Add Project Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create project.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

// update projects

export const updateProjects = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tech, live, github } = req.body;

    // Find project
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    // Update basic fields
    if (title !== undefined) project.title = title.trim();
    if (description !== undefined)
      project.description = description.trim();

    if (live !== undefined) project.live = live.trim();
    if (github !== undefined) project.github = github.trim();

    // Handle tech array
    if (tech !== undefined) {
      let technologies = tech;

      if (typeof tech === "string") {
        try {
          technologies = JSON.parse(tech);
        } catch {
          technologies = tech
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
      }

      project.tech = technologies;
    }

    if (req.file) {
      if (project.image?.publicId) {
        await cloudinary.uploader.destroy(project.image.publicId);
      }

      // Upload new image
      const uploadedImage = await uploadToCloudinary(req.file.buffer);

      project.image = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      };
    }

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      project,
    });
  } catch (error) {
    console.error("Update Project Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update project.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
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
