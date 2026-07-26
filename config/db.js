import mongoose from "mongoose";

let isConnected = false;

const connectDb = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URL);

    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};

export default connectDb;