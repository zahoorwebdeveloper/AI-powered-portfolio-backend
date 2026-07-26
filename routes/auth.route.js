import { Router } from "express";
import { login, logout } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/logout", authenticateToken, logout);

router.get("/verify", authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export default router;
