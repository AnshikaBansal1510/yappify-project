import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamToken } from "../controllers/chat.controller.js";

const router = express.Router();

// string jwt token : authenticate users
router.get("/token", protectRoute, getStreamToken);

export default router;