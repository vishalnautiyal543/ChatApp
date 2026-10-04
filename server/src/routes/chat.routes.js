import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import { accessChat } from "../controllers/chat.controller.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  accessChat
);

export default router;