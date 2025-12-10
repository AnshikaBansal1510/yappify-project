import express from "express";
import { login, logout, signup, onboard } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// send data with request
router.post("/signup", signup);
router.post("/login", login);
// post : operations that change server state
// logout: destroys a session and invalidate tokens
router.post("/logout", logout);

router.post("/onboarding", protectRoute, onboard);

// forget-password
// reset-password

// check if user is logged in and authenticated
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
})

export default router;