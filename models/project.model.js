import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    url: {
      type: String,
    },
    publicId: {
      type: String,
    },
  },
  tech: [
    {
      type: String,
    },
  ],
  live: String,
  github: String,
});

const Project = mongoose.model("Project", projectSchema);
export default Project;
