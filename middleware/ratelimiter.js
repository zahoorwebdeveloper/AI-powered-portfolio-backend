import rateLimit from "express-rate-limit";

export const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});