import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    image: {
      url: {
        type: String,
        required: [true, "Project image is required"],
        trim: true,
      },
      publicId: {
        type: String,
        required: [true, "Cloudinary public ID is required"],
        trim: true,
      },
    },

    tech: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: [],
    },

    live: {
      type: String,
      trim: true,
      default: "",
    },

    github: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;