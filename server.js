import "dotenv/config";
import express from "express";
import cors from "cors";
import compression from "compression";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";

const app = express();
//middlewares
app.use(express.json());
app.use(cookieParser())
app.use(compression());
app.use(
  cors({
    origin: [
      "https://ai-powered-portfolio-frontend.vercel.app/",
      "https://ai-powered-portfolio-frontend.vercel.app",
      "https://www.zahoorwebdev.org/",
      "https://www.zahoorwebdev.org",
      "https://zahoorwebdev.org",
      "https://zahoorwebdev.org/",
      "https://ai-powered-portfolio-frontend-ro1k3lj5l-zahoor.vercel.app/",
      "https://ai-powered-portfolio-frontend-ro1k3lj5l-zahoor.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

connectDb()

//routes
import authRoutes from "./routes/auth.route.js";
import projectRoutes from "./routes/project.route.js";
import emailRoutes from './routes/email.routes.js'
import aiRoutes from './routes/ai.route.js'
app.use("/api", authRoutes);
app.use("/api", projectRoutes);
app.use('/api', emailRoutes)
app.use('/api', aiRoutes)




if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    
    console.log(`server running on http://localhost:${PORT}`);
  });
}

export default app;
